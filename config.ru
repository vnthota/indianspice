use Rack::Static, 
  :urls => ["/stylesheets", "/images", "/scripts", "/ismenu.pdf", "/isemenu.jpg", "/machanmenu.pdf", "/aanganmenu.pdf"],
  :root => "public"

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('public/index.html', File::RDONLY)
  ]
}