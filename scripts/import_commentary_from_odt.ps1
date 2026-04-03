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

function Is-MetaLine {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Line
    )

    $globeEmoji = [System.Char]::ConvertFromUtf32(0x1F310)
    if ($Line -eq 'Plaintext') {
        return $true
    }

    if ($Line -eq '$15' -or $Line -eq '$16') {
        return $true
    }

    if ($Line -like '*Search Strategy*') {
        return $true
    }

    if ($Line.StartsWith('[') -and $Line.Contains($globeEmoji)) {
        return $true
    }

    if ($Line -like '*Verified Sources*') {
        return $true
    }

    if ($Line -like '*Online Mode*' -or $Line -like '*Offline Mode*' -or $Line -like '*Online/Offline Mode*') {
        return $true
    }

    if ($Line -like '*User Input*') {
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
$chapterData = $gitaData.$targetChapterKey
if ($null -eq $chapterData) {
    throw "Chapter $targetChapterNumber does not exist in public/gita.json."
}

$chapterVerses = @($chapterData.verses)
$contentDocument = Get-OdtXmlDocument -ResolvedOdtPath $resolvedOdtPath -EntryName 'content.xml'
$stylesDocument = Get-OdtXmlDocument -ResolvedOdtPath $resolvedOdtPath -EntryName 'styles.xml'
$namespaceManager = New-OdtNamespaceManager -Document $contentDocument
$stylesNamespaceManager = New-OdtNamespaceManager -Document $stylesDocument
$listStyleKinds = Get-ListStyleKinds -StylesDocument $stylesDocument -NamespaceManager $stylesNamespaceManager

$markerMap = @{}
for ($index = 0; $index -lt $chapterVerses.Length; $index += 1) {
    $rangeLabel = Get-RangeLabel -Verses $chapterVerses -Index $index
    $markerMap["$rangeLabel."] = [int]$chapterVerses[$index].verse
}

$body = $contentDocument.SelectSingleNode('//office:body/office:text', $namespaceManager)
if ($null -eq $body) {
    throw 'Failed to locate office:text in content.xml.'
}

$commentaryByVerse = @{}
$currentVerse = 0
$currentLines = New-Object System.Collections.Generic.List[string]
$pendingLines = New-Object System.Collections.Generic.List[string]
$titleEmitted = $false
$skipMetaSection = $false
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
        if ($markerMatch.Success -and $markerMap.ContainsKey($markerMatch.Groups['marker'].Value)) {
            if ($currentVerse -ne 0) {
                if (-not $titleEmitted) {
                    $currentLines = $pendingLines
                }

                $commentaryByVerse[$currentVerse] = Finalize-Lines -Lines $currentLines
            }

            $currentVerse = [int]$markerMap[$markerMatch.Groups['marker'].Value]
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

        if ($currentVerse -eq 0) {
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

        $styleName = Get-StyleName -Node $childNode -NamespaceManager $namespaceManager
        if (-not $titleEmitted -and $styleName -eq 'P611') {
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

    if ($currentVerse -eq 0 -or $skipMetaSection) {
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

if ($currentVerse -ne 0) {
    if (-not $titleEmitted) {
        $currentLines = $pendingLines
    }

    $commentaryByVerse[$currentVerse] = Finalize-Lines -Lines $currentLines
}

foreach ($verse in $chapterVerses) {
    $verseNumber = [int]$verse.verse
    if (-not $commentaryByVerse.ContainsKey($verseNumber)) {
        throw "No imported commentary block found for chapter $targetChapterNumber verse key $verseNumber."
    }

    $verse.commentary_en = [string]$commentaryByVerse[$verseNumber]
}

$jsonOutput = $gitaData | ConvertTo-Json -Depth 100
[System.IO.File]::WriteAllText($gitaJsonPath, $jsonOutput)

$summary = [ordered]@{
    chapter = $targetChapterNumber
    source = [System.IO.Path]::GetFileName($resolvedOdtPath)
    storedVerseEntries = $chapterVerses.Length
    importedBlocks = $commentaryByVerse.Count
}
$summary | ConvertTo-Json
