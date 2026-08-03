$images = @(
    "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1416879598555-227282b20e03?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558904541-efa843a96f09?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589209536136-1e6bb45564c7?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=1600&auto=format&fit=crop"
)

for($i=0; $i -lt $images.Length; $i++) {
    $dest = "bahce-ekipmanlari-img\watering-slider$($i+1).jpg"
    Invoke-WebRequest -Uri $images[$i] -OutFile $dest
}
