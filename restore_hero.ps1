$html = Get-Content 'index.html' -Raw -Encoding UTF8

$oldHero = @"
        <section class="hero-banner" style="background: linear-gradient(135deg, #004797 0%, #0066CC 100%); border-radius: var(--border-radius); padding: 60px 40px; margin: 30px 0; color: #ffffff; text-align: center; box-shadow: 0 15px 30px rgba(0, 71, 151, 0.18); position: relative; overflow: hidden;">
            
            <!-- Watermark Logo -->
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 100%; background: url('WhatsApp Image 2025-07-25 at 23.57.21 (1)-Photoroom.png') no-repeat center center / contain; opacity: 0.12; filter: brightness(0) invert(1); pointer-events: none;"></div>

            <!-- Content -->
            <div style="position: relative; z-index: 1;">
                <div style="display: inline-block; background: rgba(255, 255, 255, 0.15); padding: 5px 15px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 15px; letter-spacing: 1px;">
                    <i class="fas fa-award" style="margin-right: 5px;"></i> TÜRKİYE'NİN GÜVENİLİR SULAMA MARKASI
                </div>
                
                <h1 style="font-size: 2.4rem; font-weight: 700; margin: 0 0 15px 0; letter-spacing: -0.5px;">BAYRAKÇI SULAMA VE YAPI MALZEMELERİ</h1>
                
                <p style="font-size: 1.15rem; max-width: 750px; margin: 0 auto 30px auto; opacity: 0.92; line-height: 1.7;">Yüksek basınç dayanımlı (PN16) Mavi & Siyah Seri Kaplinler, Priz Kolyeler, Vanalar ve tüm sulama parçalarında dayanıklı ve uzun ömürlü boru bağlantı çözümleri.</p>

                <!-- Badges Container (Centered) -->
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;">
                    <span style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(5px);">
                        <i class="fas fa-check-circle" style="color: #ffffff;"></i> PN16 Yüksek Basınç Dayanımı
                    </span>
                    <span style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(5px);">
                        <i class="fas fa-check-circle" style="color: #ffffff;"></i> UV Korumalı %100 Orijinal Hammadde
                    </span>
                    <span style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(5px);">
                        <i class="fas fa-check-circle" style="color: #ffffff;"></i> Sızdırmazlık Garantili
                    </span>
                    <span style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(5px);">
                        <i class="fas fa-flag-checkered" style="color: #ffffff;"></i> %100 YERLİ ÜRETİM
                    </span>
                    <span style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(5px);">
                        <i class="fas fa-shipping-fast" style="color: #ffffff;"></i> AYNI GÜN HIZLI KARGO
                    </span>
                </div>
            </div>
        </section>
"@

$html = $html -replace '(?s)<section class="hero-banner".*?</section>', $oldHero
Set-Content 'index.html' -Value $html -Encoding UTF8
Write-Host "Replaced hero banner"
