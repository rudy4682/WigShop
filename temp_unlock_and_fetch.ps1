$ErrorActionPreference = 'Stop'
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$preview = 'https://wam-dev.myshopify.com/?preview_theme_id=183285514562'
$pwUrl = 'https://wam-dev.myshopify.com/password'

# Get the password page to retrieve authenticity_token and cookies
Invoke-WebRequest -Uri $preview -WebSession $session -OutFile 'v:\VS_Repos\VS_Code\Shopify\Themes\WigShop\temp_pw_page.html' -UseBasicParsing

$content = Get-Content -Raw -Path 'v:\VS_Repos\VS_Code\Shopify\Themes\WigShop\temp_pw_page.html'
$tokenMatch = [regex]::Match($content, 'name="authenticity_token" value="([^"]+)"')
if (-not $tokenMatch.Success) {
  Write-Error "authenticity_token not found"
  exit 2
}
$token = $tokenMatch.Groups[1].Value
Write-Host "authenticity_token found"

$body = @{
  'password' = 'wam'
  'authenticity_token' = $token
}

Invoke-WebRequest -Uri $pwUrl -Method Post -Body $body -WebSession $session -OutFile 'v:\VS_Repos\VS_Code\Shopify\Themes\WigShop\temp_pw_response.html' -UseBasicParsing
Write-Host "Posted password, status page saved"

# Fetch product page using same session
$productUrl = 'https://wam-dev.myshopify.com/products/egepicavg?preview_theme_id=183285514562'
Invoke-WebRequest -Uri $productUrl -WebSession $session -OutFile 'v:\VS_Repos\VS_Code\Shopify\Themes\WigShop\temp_product_egepicavg.html' -UseBasicParsing
Write-Host "Fetched product page to temp_product_egepicavg.html"

# Run the node script to analyze scripts
node 'v:\temp_check_scripts.js'
