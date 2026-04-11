param(
    [int]$ChapterNumber = 0,
    [string]$OdtPath = ''
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Read-Utf8Text {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    $text = [System.IO.File]::ReadAllText($Path)
    if ($text.Length -gt 0 -and [int][char]$text[0] -eq 0xFEFF) {
        return $text.Substring(1)
    }

    return $text
}

function Get-OdtXmlDocument {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ResolvedOdtPath,
        [Parameter(Mandatory = $true)]
        [string]$EntryName
    )

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead($ResolvedOdtPath)
    try {
        $entry = $zip.GetEntry($EntryName)
        if ($null -eq $entry) {
            throw "ODT entry '$EntryName' not found."
        }

        $reader = New-Object System.IO.StreamReader($entry.Open())
        try {
            $content = $reader.ReadToEnd()
        }
        finally {
            $reader.Dispose()
        }
    }
    finally {
        $zip.Dispose()
    }

    $xml = New-Object System.Xml.XmlDocument
    $xml.LoadXml($content)
    return $xml
}

function New-OdtNamespaceManager {
    param(
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlDocument]$Document
    )

    $namespaceManager = New-Object System.Xml.XmlNamespaceManager($Document.NameTable)
    [void]$namespaceManager.AddNamespace('office', 'urn:oasis:names:tc:opendocument:xmlns:office:1.0')
    [void]$namespaceManager.AddNamespace('text', 'urn:oasis:names:tc:opendocument:xmlns:text:1.0')
    [void]$namespaceManager.AddNamespace('table', 'urn:oasis:names:tc:opendocument:xmlns:table:1.0')
    [void]$namespaceManager.AddNamespace('style', 'urn:oasis:names:tc:opendocument:xmlns:style:1.0')
    return ,$namespaceManager
}

function Normalize-Text {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Text
    )

    return $Text.Replace([char]0x00A0, ' ').Replace("`r", '').Replace("`n", ' ').Trim()
}

function Get-ListStyleKinds {
    param(
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlDocument]$StylesDocument,
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlNamespaceManager]$NamespaceManager
    )

    $styleKinds = @{}
    $listStyles = $StylesDocument.SelectNodes('//text:list-style', $NamespaceManager)
    foreach ($listStyle in $listStyles) {
        $styleName = $listStyle.GetAttribute('name', $NamespaceManager.LookupNamespace('style'))
        if ([string]::IsNullOrWhiteSpace($styleName)) {
            $styleName = $listStyle.GetAttribute('style:name')
        }

        if ([string]::IsNullOrWhiteSpace($styleName)) {
            continue
        }

        foreach ($childNode in $listStyle.ChildNodes) {
            if ($childNode.LocalName -eq 'list-level-style-number') {
                $styleKinds[$styleName] = 'ordered'
                break
            }

            if ($childNode.LocalName -eq 'list-level-style-bullet') {
                $styleKinds[$styleName] = 'bullet'
                break
            }
        }
    }

    return $styleKinds
}

function Get-StyleName {
    param(
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlNode]$Node,
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlNamespaceManager]$NamespaceManager
    )

    $styleName = $Node.GetAttribute('style-name', $NamespaceManager.LookupNamespace('text'))
    if ([string]::IsNullOrWhiteSpace($styleName)) {
        return $Node.GetAttribute('text:style-name')
    }

    return $styleName
}

function Get-NodeText {
    param(
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlNode]$Node
    )

    return Normalize-Text $Node.InnerText
}

function New-TextFromCodePoints {
    param(
        [Parameter(Mandatory = $true)]
        [int[]]$CodePoints
    )

    $builder = New-Object System.Text.StringBuilder
    foreach ($codePoint in $CodePoints) {
        [void]$builder.Append([char]$codePoint)
    }

    return $builder.ToString()
}

function Remove-DateTagSuffix {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    $trimmed = $Text.Trim()
    $patterns = @(
        '\s*[\(\[]?(?:20\d{2}|\d{2})(?:[-.]\d{2}){2}[\)\]]?\s*',
        '\s*[\(\[]?(?:20\d{2}|\d{2})[\)\]]?\s*'
    )

    foreach ($pattern in $patterns) {
        $trimmed = [regex]::Replace($trimmed, $pattern, ' ')
    }

    $trimmed = [regex]::Replace($trimmed, '\s{2,}', ' ')
    $trimmed = $trimmed.Trim(" `t`r`n-:·•[]()")

    return $trimmed
}

function Test-ReferenceHeading {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    $normalized = $Text.Normalize([System.Text.NormalizationForm]::FormKC)
    $normalized = $normalized.Replace([char]0x00A0, ' ').Trim()
    $normalized = $normalized.TrimStart('#', ' ', [char]0x00B7, [char]0x2022, '-', '[', ']', ':')

    $headings = @(
        '참조 출처',
        '참고문헌',
        '참고 자료',
        '참고자료',
        '출처',
        'Verified Sources',
        'Search Strategy'
    )

    foreach ($heading in $headings) {
        if ($normalized.StartsWith($heading)) {
            return $true
        }
    }

    return $false
}

function Test-CommentaryMetaLine {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    $normalized = $Text.Normalize([System.Text.NormalizationForm]::FormKC)
    $normalized = $normalized.Replace([char]0x00A0, ' ').Trim()

    if ($normalized -eq '') {
        return $true
    }

    if ([regex]::IsMatch($normalized, '\((?:20\d{2}|\d{2})(?:[-.]\d{2}){2}\)|\((?:20\d{2}|\d{2})\)')) {
        return $true
    }

    if (Test-ReferenceHeading -Text $normalized) {
        return $true
    }

    $metaFragments = @(
        'Search Strategy',
        'Verified Sources',
        'User Provided Text',
        'Holy Bhagavad Gita',
        '사용자 제공',
        '사용자가 제공',
        '사용자 입력',
        '사용자 데이터',
        '공유된 텍스트',
        '제공된 텍스트',
        '제공된 원문',
        '원문 데이터',
        '텍스트 기반',
        '내부 자료',
        '내부 데이터',
        '내부 기록',
        '지식 베이스',
        '보고서',
        '가이드',
        '강의록',
        '강의 요약',
        '강의 기록',
        '강연록',
        '강연 텍스트',
        '강독 자료',
        '출처',
        '참고문헌',
        '참고 자료',
        '참고자료',
        '참조 출처'
    )

    foreach ($fragment in $metaFragments) {
        if ($normalized.Contains($fragment)) {
            return $true
        }
    }

    if ($normalized -match '^(?:[#\s\[\]·•\-\–—🛡📝📚🧾⚠🔗🏛]*)(?:User Provided Text|사용자 제공|제공된 텍스트|제공된 원문|내부 자료|내부 데이터|보고서|가이드|강의록|강의 요약|강의 기록|강연록|강연 텍스트|강독 자료|원문 데이터|텍스트 기반|참고문헌|참고 자료|참고자료|참조 출처)') {
        return $true
    }

    return $false
}

function Remove-CommentaryResidue {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    if ($Text -eq '') {
        return ''
    }

    $cleanedLines = New-Object System.Collections.Generic.List[string]
    $lines = $Text -split "`r?`n"
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed -eq '') {
            if ($cleanedLines.Count -gt 0 -and $cleanedLines[$cleanedLines.Count - 1] -ne '') {
                $cleanedLines.Add('')
            }

            continue
        }

        if (Test-CommentaryMetaLine -Text $trimmed) {
            continue
        }

        $cleanedLines.Add($trimmed)
    }

    while ($cleanedLines.Count -gt 0 -and $cleanedLines[$cleanedLines.Count - 1] -eq '') {
        $cleanedLines.RemoveAt($cleanedLines.Count - 1)
    }

    while ($cleanedLines.Count -gt 0 -and $cleanedLines[0] -eq '') {
        $cleanedLines.RemoveAt(0)
    }

    return ($cleanedLines -join "`n").Trim()
}

function Is-MetaLine {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Line
    )

    $globeEmoji = [System.Char]::ConvertFromUtf32(0x1F310)
    $normalized = $Line.Trim()
    if (Test-CommentaryMetaLine -Text $normalized) {
        return $true
    }
    $normalized = Remove-DateTagSuffix -Text $normalized

    if ($normalized -eq '') {
        return $true
    }
    $normalized = $normalized.TrimStart([char]0x00B7, ' ', '·')

    if ($normalized -eq '') {
        return $true
    }

    $sourceTitle = New-TextFromCodePoints @(48148, 44032, 48148, 46300, 32, 44592, 53440)
    $academicWord = New-TextFromCodePoints @(54617, 49696)
    $reviewWord = New-TextFromCodePoints @(44428, 50948)
    $commentaryWord = New-TextFromCodePoints @(51452, 49437, 49436)
    $sourceWord = New-TextFromCodePoints @(52636, 52376)
    $searchWord = New-TextFromCodePoints @(53456, 49353)
    $userWord = New-TextFromCodePoints @(49324, 50857)
    $provideWord = New-TextFromCodePoints @(51228, 44277)
    $textWord = New-TextFromCodePoints @(53581, 49828, 53944)
    $backgroundWord = New-TextFromCodePoints @(48124, 44221)
    $infoWord = New-TextFromCodePoints @(51221, 48372)
    $tenPlusWord = '10'

    if ($Line -eq 'Plaintext') {
        return $true
    }

    if ($Line -eq '$15' -or $Line -eq '$16') {
        return $true
    }

    if (
        $normalized -match '^사용자 제공 텍스트(\s|$)' -or
        $normalized -match '^사용자 공유 텍스트(\s|$)' -or
        $normalized -match '^제공된 텍스트 원문(\s|$)' -or
        $normalized -match '^사용자가 제공한 텍스트 자료만을 분석하여 요약함(\s|$)' -or
        $normalized -match '^외부 웹 검색은 수행하지 않음(\s|$)' -or
        $normalized -match '^제공된 본문 텍스트만을 바탕으로(\s|$)'
    ) {
        return $true
    }

    $compact = $normalized.Normalize([System.Text.NormalizationForm]::FormKC)
    $compact = $compact.Replace([char]0x00A0, ' ')
    $compact = $compact -replace '\s+', ''
    $compact = $compact -replace '[\p{P}\p{S}]', ''

    $userProvidedText = New-TextFromCodePoints @(49324, 50857, 51088, 51228, 44277, 53581, 49828, 53944)
    $userSharedText = New-TextFromCodePoints @(49324, 50857, 51088, 44277, 50976, 53581, 49828, 53944)
    $providedRawText = New-TextFromCodePoints @(51228, 44277, 46108, 53581, 49828, 53944, 50896, 47928)
    $userProvidedTextAnalysis = New-TextFromCodePoints @(49324, 50857, 51088, 44032, 51228, 44277, 54620, 53581, 49828, 53944, 51088, 47308, 47564, 51012, 48516, 49437, 54616, 50668, 50836, 50557, 54632)
    $noExternalWebSearch = New-TextFromCodePoints @(50808, 48512, 50976, 44160, 49353, 51008, 49688, 54665, 54616, 51648, 50506, 51020)
    $providedBodyOnly = New-TextFromCodePoints @(51228, 44277, 46108, 48376, 47928, 53581, 49828, 53944, 47564, 51012, 48148, 53461, 51004, 47196)

    if (
        $compact.StartsWith($userProvidedText) -or
        $compact.StartsWith($userSharedText) -or
        $compact.StartsWith($providedRawText) -or
        $compact.StartsWith($userProvidedTextAnalysis) -or
        $compact.StartsWith($noExternalWebSearch) -or
        $compact.StartsWith($providedBodyOnly)
    ) {
        return $true
    }
    if ($normalized -like '*Search Strategy*') {
        return $true
    }

    if ($normalized -like ('*{0}*' -f $academicWord) -or $normalized -like ('*{0}*' -f $reviewWord) -or $normalized -like ('*{0}*' -f $commentaryWord)) {
        return $true
    }

    if ($normalized -like ('*{0}*' -f $sourceTitle) -and (
        $normalized -like ('*{0}*' -f $academicWord) -or
        $normalized -like ('*{0}*' -f $reviewWord) -or
        $normalized -like ('*{0}*' -f $commentaryWord) -or
        $normalized -like ('*{0}*' -f $sourceWord) -or
        $normalized -like ('*{0}*' -f $searchWord) -or
        $normalized -like ('*{0}*' -f $userWord) -or
        $normalized -like ('*{0}*' -f $provideWord) -or
        $normalized -like ('*{0}*' -f $textWord) -or
        $normalized -like ('*{0}*' -f $backgroundWord) -or
        $normalized -like ('*{0}*' -f $infoWord)
    )) {
        return $true
    }

    if ($normalized -like ('*{0}*' -f $sourceWord) -and ($normalized -like ('*{0}*' -f $academicWord) -or $normalized -like ('*{0}*' -f $searchWord) -or $normalized -like ('*{0}*' -f $backgroundWord))) {
        return $true
    }

    if ($normalized -like '*신뢰할 수 있는*출처*' -or $normalized -like '*신뢰할 수 있는 10개 이상의 출처*' -or $normalized -like '*탐색하여*' -or $normalized -like '*배경 정보를 확인*' -or $normalized -like '*출처를 확보*') {
        return $true
    }

    if ($normalized -like '*사용자가 제공한 텍스트*' -or $normalized -like '*사용자가 제공한 텍스트의 배경 정보*' -or $normalized -like '*사용자 제공 텍스트*' -or $normalized -like '*사용자 제공 자료*') {
        return $true
    }

    if ($normalized -like '*제공 자료*' -or $normalized -like '*강연록*' -or $normalized -like '*텍스트 섹션*') {
        return $true
    }

    if ($normalized -like '*Verified Sources*') {
        return $true
    }

    if ($normalized -like '*Online Mode*' -or $normalized -like '*Offline Mode*' -or $normalized -like '*Online/Offline Mode*') {
        return $true
    }

    if ($normalized -like '*User Input*') {
        return $true
    }

    if (
        $normalized -like '사용자가 제공한 텍스트 자료만을 분석하여 요약함*' -or
        $normalized -like '*외부 웹 검색은 수행하지 않음*' -or
        $normalized -like '제공된 본문 텍스트만을 바탕으로*' -or
        $normalized -like '사용자 제공 텍스트*' -or
        $normalized -like '사용자 공유 텍스트*' -or
        $normalized -like '제공된 텍스트 원문*' -or
        $normalized -like '사용자 제공 텍스트 데이터*' -or
        $normalized -like '사용자 제공 원문*' -or
        $normalized -like '제공된 텍스트 자료*' -or
        $normalized -like '사용자가 제공한 텍스트 자료만을 분석하여 요약함*'
    ) {
        return $true
    }

    if ($Line.StartsWith('[') -and $Line.Contains($globeEmoji)) {
        return $true
    }

    return $false
}

function Add-Line {
    param(
        [Parameter(Mandatory = $true)]
        $Lines,
        [Parameter(Mandatory = $true)]
        [string]$Line
    )

    $trimmed = $Line.Trim()
    if ($trimmed -eq '' -or (Is-MetaLine $trimmed)) {
        return
    }

    $Lines.Add($trimmed)
}

function Add-BlankLine {
    param(
        [Parameter(Mandatory = $true)]
        $Lines
    )

    if ($Lines.Count -eq 0) {
        return
    }

    if ($Lines[$Lines.Count - 1] -ne '') {
        $Lines.Add('')
    }
}

function Convert-ParagraphNode {
    param(
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlNode]$Node,
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlNamespaceManager]$NamespaceManager,
        [Parameter(Mandatory = $true)]
        $Lines
    )

    $text = Get-NodeText $Node
    if ($text -eq '' -or (Is-MetaLine $text)) {
        return
    }

    if ($text -eq '📝 핵심 요약') {
        Add-BlankLine -Lines $Lines
        Add-Line -Lines $Lines -Line $text
        return
    }

    $styleName = Get-StyleName -Node $Node -NamespaceManager $NamespaceManager
    if ($styleName -eq 'P276') {
        if ($Lines.Count -eq 0) {
            Add-Line -Lines $Lines -Line "# $text"
        }
        else {
            Add-BlankLine -Lines $Lines
            Add-Line -Lines $Lines -Line "## $text"
        }
        return
    }

    if ($styleName -eq 'P277') {
        Add-BlankLine -Lines $Lines
        Add-Line -Lines $Lines -Line "## $text"
        return
    }

    Add-BlankLine -Lines $Lines
    Add-Line -Lines $Lines -Line $text
}

function Convert-ListNode {
    param(
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlNode]$Node,
        [Parameter(Mandatory = $true)]
        [hashtable]$ListStyleKinds,
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlNamespaceManager]$NamespaceManager,
        [Parameter(Mandatory = $true)]
        $Lines
    )

    $styleName = $Node.GetAttribute('style-name', $NamespaceManager.LookupNamespace('text'))
    if ([string]::IsNullOrWhiteSpace($styleName)) {
        $styleName = $Node.GetAttribute('text:style-name')
    }

    $kind = 'bullet'
    if ($ListStyleKinds.ContainsKey($styleName)) {
        $kind = [string]$ListStyleKinds[$styleName]
    }

    $items = New-Object System.Collections.Generic.List[string]
    $listItems = $Node.SelectNodes('./text:list-item', $NamespaceManager)
    foreach ($listItem in $listItems) {
        $itemParagraphs = $listItem.SelectNodes('./text:p', $NamespaceManager)
        $parts = New-Object System.Collections.Generic.List[string]
        foreach ($paragraph in $itemParagraphs) {
            $text = Get-NodeText $paragraph
            if ($text -ne '' -and -not (Is-MetaLine $text)) {
                $parts.Add($text)
            }
        }

        $itemText = ($parts -join ' ').Trim()
        $itemText = $itemText -replace '^[^\p{L}\p{N}]+', ''
        if ($itemText -ne '') {
            $items.Add($itemText)
        }
    }

    if ($items.Count -eq 0) {
        return
    }

    Add-BlankLine -Lines $Lines
    for ($index = 0; $index -lt $items.Count; $index += 1) {
        if ($kind -eq 'ordered') {
            Add-Line -Lines $Lines -Line ('{0}. {1}' -f ($index + 1), $items[$index])
        }
        else {
            Add-Line -Lines $Lines -Line ('{0} {1}' -f ([char]0x00B7), $items[$index])
        }
    }
}

function Convert-TableNode {
    param(
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlNode]$Node,
        [Parameter(Mandatory = $true)]
        [System.Xml.XmlNamespaceManager]$NamespaceManager,
        [Parameter(Mandatory = $true)]
        $Lines
    )

    $rows = New-Object System.Collections.Generic.List[object]
    $tableRows = $Node.SelectNodes('./table:table-row', $NamespaceManager)
    foreach ($tableRow in $tableRows) {
        $cells = New-Object System.Collections.Generic.List[string]
        $tableCells = $tableRow.SelectNodes('./table:table-cell', $NamespaceManager)
        foreach ($tableCell in $tableCells) {
            $paragraphs = $tableCell.SelectNodes('.//text:p', $NamespaceManager)
            $parts = New-Object System.Collections.Generic.List[string]
            foreach ($paragraph in $paragraphs) {
                $text = Get-NodeText $paragraph
                if ($text -ne '') {
                    $parts.Add($text)
                }
            }

            $cellText = ($parts -join '<br/>').Trim()
            $cells.Add($cellText)
        }

        if ($cells.Count -gt 0) {
            $rows.Add($cells)
        }
    }

    if ($rows.Count -eq 0) {
        return
    }

    Add-BlankLine -Lines $Lines
    $headerCells = [System.Collections.Generic.List[string]]$rows[0]
    Add-Line -Lines $Lines -Line ('| ' + ($headerCells -join ' | ') + ' |')
    Add-Line -Lines $Lines -Line ('| ' + (($headerCells | ForEach-Object { '---' }) -join ' | ') + ' |')

    for ($index = 1; $index -lt $rows.Count; $index += 1) {
        $rowCells = [System.Collections.Generic.List[string]]$rows[$index]
        Add-Line -Lines $Lines -Line ('| ' + ($rowCells -join ' | ') + ' |')
    }
}

function Get-RangeLabel {
    param(
        [Parameter(Mandatory = $true)]
        [object[]]$Verses,
        [Parameter(Mandatory = $true)]
        [int]$Index
    )

    $currentVerse = [int]$Verses[$Index].verse
    if ($Index -lt $Verses.Length - 1) {
        $nextVerse = [int]$Verses[$Index + 1].verse
        if ($nextVerse -gt ($currentVerse + 1)) {
            return '{0}-{1}' -f $currentVerse, ($nextVerse - 1)
        }
    }

    return [string]$currentVerse
}

function Finalize-Lines {
    param(
        [Parameter(Mandatory = $true)]
        $Lines
    )

    $cleaned = New-Object System.Collections.Generic.List[string]
    foreach ($line in $Lines) {
        $trimmed = $line.Trim()
        if ($trimmed -eq '' -and ($cleaned.Count -eq 0 -or $cleaned[$cleaned.Count - 1] -eq '')) {
            continue
        }

        if ($trimmed -ne '' -or $cleaned.Count -gt 0) {
            $cleaned.Add($trimmed)
        }
    }

    while ($cleaned.Count -gt 0 -and $cleaned[$cleaned.Count - 1] -eq '') {
        $cleaned.RemoveAt($cleaned.Count - 1)
    }

    return ($cleaned -join "`n").Trim()
}

function Normalize-TitleKeywordSpacing {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    if ($Text -eq '') {
        return ''
    }

    $keyEmoji = [System.Char]::ConvertFromUtf32(0x1F511)
    $lines = $Text -split "`r?`n"
    $titleIndex = -1
    $keywordIndex = -1

    for ($index = 0; $index -lt $lines.Count; $index += 1) {
        $trimmed = $lines[$index].Trim()
        if ($titleIndex -lt 0 -and $trimmed.StartsWith('#')) {
            $titleIndex = $index
            continue
        }

        if ($titleIndex -ge 0 -and $keywordIndex -lt 0 -and $trimmed.StartsWith($keyEmoji)) {
            $keywordIndex = $index
            break
        }
    }

    if ($titleIndex -lt 0 -or $keywordIndex -lt 0 -or $keywordIndex -le $titleIndex) {
        return $Text
    }

    $normalized = New-Object System.Collections.Generic.List[string]
    for ($index = 0; $index -lt $lines.Count; $index += 1) {
        $trimmed = $lines[$index].Trim()
        if ($index -gt $titleIndex -and $index -lt $keywordIndex -and $trimmed -ne '') {
            continue
        }

        $normalized.Add($trimmed)
    }

    return (Finalize-Lines -Lines $normalized)
}

function Resolve-ChapterInputs {
    param(
        [Parameter(Mandatory = $true)]
        [string]$WorkspaceRoot,
        [int]$RequestedChapterNumber,
        [string]$RequestedOdtPath
    )

    if ($RequestedOdtPath -ne '') {
        $resolvedOdtPath = (Resolve-Path -LiteralPath $RequestedOdtPath).Path
        if ($RequestedChapterNumber -eq 0) {
            $matchedChapter = [regex]::Match([System.IO.Path]::GetFileNameWithoutExtension($resolvedOdtPath), '_(\d+)')
            if (-not $matchedChapter.Success) {
                throw 'Chapter number was not provided and could not be inferred from the ODT filename.'
            }
            $RequestedChapterNumber = [int]$matchedChapter.Groups[1].Value
        }

        return [ordered]@{
            ChapterNumber = $RequestedChapterNumber
            OdtPath = $resolvedOdtPath
        }
    }

    if ($RequestedChapterNumber -le 0) {
        throw 'Either -ChapterNumber or -OdtPath must be provided.'
    }

    $odtFile = Get-ChildItem -LiteralPath $WorkspaceRoot -Filter '*.odt' |
        Where-Object { $_.BaseName -match ("_{0}(?:\D|$)" -f $RequestedChapterNumber) } |
        Select-Object -First 1

    if ($null -eq $odtFile) {
        throw "No ODT file matching chapter $RequestedChapterNumber was found."
    }

    return [ordered]@{
        ChapterNumber = $RequestedChapterNumber
        OdtPath = $odtFile.FullName
    }
}

$workspaceRoot = 'C:\Users\roadsea\Desktop\gita'
$gitaJsonPath = Join-Path $workspaceRoot 'public\gita.json'
$resolvedInputs = Resolve-ChapterInputs -WorkspaceRoot $workspaceRoot -RequestedChapterNumber $ChapterNumber -RequestedOdtPath $OdtPath
$targetChapterNumber = [int]$resolvedInputs.ChapterNumber
$targetChapterKey = [string]$targetChapterNumber
$resolvedOdtPath = [string]$resolvedInputs.OdtPath

$gitaText = Read-Utf8Text -Path $gitaJsonPath
$gitaData = $gitaText | ConvertFrom-Json
$chapterProperty = $gitaData.PSObject.Properties[$targetChapterKey]
if ($null -eq $chapterProperty) {
    throw "Chapter $targetChapterNumber does not exist in public/gita.json."
}

$chapterData = $chapterProperty.Value
if ($null -eq $chapterData) {
    throw "Chapter $targetChapterNumber does not exist in public/gita.json."
}

$chapterVerses = @($chapterData.verses)
$contentDocument = Get-OdtXmlDocument -ResolvedOdtPath $resolvedOdtPath -EntryName 'content.xml'
$stylesDocument = Get-OdtXmlDocument -ResolvedOdtPath $resolvedOdtPath -EntryName 'styles.xml'
$namespaceManager = New-OdtNamespaceManager -Document $contentDocument
$stylesNamespaceManager = New-OdtNamespaceManager -Document $stylesDocument
$listStyleKinds = Get-ListStyleKinds -StylesDocument $stylesDocument -NamespaceManager $stylesNamespaceManager

$body = $contentDocument.SelectSingleNode('//office:body/office:text', $namespaceManager)
if ($null -eq $body) {
    throw 'Failed to locate office:text in content.xml.'
}

$commentaryBlocks = New-Object System.Collections.Generic.List[string]
$currentLines = New-Object System.Collections.Generic.List[string]
$pendingLines = New-Object System.Collections.Generic.List[string]
$titleEmitted = $false
$skipMetaSection = $false
$blockStarted = $false
$referencePrefix = [System.Char]::ConvertFromUtf32(0x1F517)

function Append-Lines {
    param(
        [Parameter(Mandatory = $true)]
        $Destination,
        [Parameter(Mandatory = $true)]
        $Source
    )

    foreach ($line in $Source) {
        $Destination.Add([string]$line)
    }
}

foreach ($childNode in $body.ChildNodes) {
    if ($childNode.LocalName -eq 'p') {
        $text = Get-NodeText $childNode
        if ($text -eq '') {
            continue
        }

        $markerMatch = [regex]::Match($text, '^(?<marker>\d+(?:-\d+)?\.)(?<rest>.*)$')
        $styleName = Get-StyleName -Node $childNode -NamespaceManager $namespaceManager
        $isVerseMarker = $markerMatch.Success -and $styleName -ne 'Standard'
        if ($isVerseMarker) {
            if ($blockStarted) {
                if (-not $titleEmitted) {
                    $currentLines = $pendingLines
                }

                $commentaryBlocks.Add((Finalize-Lines -Lines $currentLines))
            }

            $blockStarted = $true
            $currentLines = New-Object System.Collections.Generic.List[string]
            $pendingLines = New-Object System.Collections.Generic.List[string]
            $titleEmitted = $false
            $skipMetaSection = $false

            $rest = Normalize-Text $markerMatch.Groups['rest'].Value
            if ($rest -ne '') {
                if ($rest.StartsWith('[')) {
                    Add-Line -Lines $currentLines -Line $rest
                }
                else {
                    Convert-ParagraphNode -Node $childNode -NamespaceManager $namespaceManager -Lines $currentLines
                }
            }

            continue
        }

        if (-not $blockStarted) {
            continue
        }

        if ($text -eq '📝 핵심 요약') {
            if ($titleEmitted) {
                Add-BlankLine -Lines $currentLines
                Add-Line -Lines $currentLines -Line $text
            }
            else {
                Add-BlankLine -Lines $pendingLines
                Add-Line -Lines $pendingLines -Line $text
            }
            continue
        }

        if (Is-MetaLine $text) {
            continue
        }

        if ($text.StartsWith($referencePrefix) -or $text -like '*Verified Sources*') {
            $skipMetaSection = $true
            continue
        }

        if ($skipMetaSection) {
            continue
        }

        if (-not $titleEmitted -and $styleName -ne 'P1' -and $styleName -ne 'P2') {
            Add-Line -Lines $currentLines -Line "# $text"
            if ($pendingLines.Count -gt 0) {
                Add-BlankLine -Lines $currentLines
                Append-Lines -Destination $currentLines -Source $pendingLines
                $pendingLines.Clear()
            }

            $titleEmitted = $true
            continue
        }

        if ($titleEmitted) {
            Convert-ParagraphNode -Node $childNode -NamespaceManager $namespaceManager -Lines $currentLines
        }
        else {
            Convert-ParagraphNode -Node $childNode -NamespaceManager $namespaceManager -Lines $pendingLines
        }
        continue
    }

    if ($childNode.LocalName -eq 'h') {
        if (-not $blockStarted -or $skipMetaSection) {
            continue
        }

        $text = Get-NodeText $childNode
        if ($text -eq '' -or (Is-MetaLine $text)) {
            continue
        }

        if ($text -eq '📝 핵심 요약') {
            if ($titleEmitted) {
                Add-BlankLine -Lines $currentLines
                Add-Line -Lines $currentLines -Line $text
            }
            else {
                Add-BlankLine -Lines $pendingLines
                Add-Line -Lines $pendingLines -Line $text
            }
        }

        continue
    }

    if (-not $blockStarted -or $skipMetaSection) {
        continue
    }

    if ($childNode.LocalName -eq 'list') {
        if ($titleEmitted) {
            Convert-ListNode -Node $childNode -ListStyleKinds $listStyleKinds -NamespaceManager $namespaceManager -Lines $currentLines
        }
        else {
            Convert-ListNode -Node $childNode -ListStyleKinds $listStyleKinds -NamespaceManager $namespaceManager -Lines $pendingLines
        }
        continue
    }

    if ($childNode.LocalName -eq 'table') {
        if ($titleEmitted) {
            Convert-TableNode -Node $childNode -NamespaceManager $namespaceManager -Lines $currentLines
        }
        else {
            Convert-TableNode -Node $childNode -NamespaceManager $namespaceManager -Lines $pendingLines
        }
    }
}

if ($blockStarted) {
    if (-not $titleEmitted) {
        $currentLines = $pendingLines
    }

    $commentaryBlocks.Add((Normalize-TitleKeywordSpacing -Text (Finalize-Lines -Lines $currentLines)))
}

if ($commentaryBlocks.Count -ne $chapterVerses.Length) {
    Write-Warning "Imported commentary block count ($($commentaryBlocks.Count)) does not match chapter $targetChapterNumber verse count ($($chapterVerses.Length)). Proceeding with available blocks."
}

foreach ($verse in $chapterVerses) {
    $verseIndex = [int]$verse.verse - 1
    if ($verseIndex -lt 0 -or $verseIndex -ge $commentaryBlocks.Count) {
        continue
    }

    $verse.commentary_en = [string]$commentaryBlocks[$verseIndex]
}

$cleanupCount = 0
foreach ($chapterProperty in $gitaData.PSObject.Properties) {
    $chapter = $chapterProperty.Value
    foreach ($verse in @($chapter.verses)) {
        $originalCommentary = [string]$verse.commentary_en
        $cleanedCommentary = Remove-CommentaryResidue -Text $originalCommentary
        $cleanedCommentary = Normalize-TitleKeywordSpacing -Text $cleanedCommentary
        if ($cleanedCommentary -ne $originalCommentary) {
            $verse.commentary_en = $cleanedCommentary
            $cleanupCount += 1
        }
    }
}

$jsonOutput = $gitaData | ConvertTo-Json -Depth 100
[System.IO.File]::WriteAllText($gitaJsonPath, $jsonOutput)

$summary = [ordered]@{
    chapter = $targetChapterNumber
    source = [System.IO.Path]::GetFileName($resolvedOdtPath)
    storedVerseEntries = $chapterVerses.Length
    importedBlocks = $commentaryBlocks.Count
    cleanedCommentaries = $cleanupCount
}
$summary | ConvertTo-Json
