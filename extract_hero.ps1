$content = Get-Content 'test_payload.html' -Raw
if ($content -match '(?s)(<section class="hero-banner".*?</section>)') {
    Set-Content 'old_hero.txt' -Value $matches[1] -Encoding UTF8
    Write-Host "Extracted"
}
