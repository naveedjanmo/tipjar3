// loop over each section, get image and replace with canvas

const sections = document.querySelectorAll("section")

sections.forEach(section => {

    const originalImage = section.querySelector("img")
    const originalImageSource = originalImage.getAttribute("src")

    section.innerHTML = ""

    // set up a pixi application
    const app = new PIXI.Application({
        width: 1100,
        height: 800,
        transparent: true
    })
    
    // add app to section tag
    section.appendChild(app.view)

    // make new image
    let image = null
    let displacementImage = null
    let rgbFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0])

    // make new loader
    const loader = new PIXI.loaders.Loader()

    // load in an image
    loader.add("image", originalImageSource)
    loader.add("displacement", "/assets/displacement1.jpg")
    loader.load((loader, resources) => {

        image = new PIXI.Sprite(resources.image.texture)
        displacementImage = new PIXI.Sprite(resources.displacement.texture)
        
        
        image.x = 100 + 450
        image.y = 100 + 300
        image.width = 800
        image.height = 533
        image.interactive = true

        image.anchor.x = 0.5
        image.anchor.y = 0.5

        displacementImage.width = 600
        displacementImage.height = 600
        displacementImage.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT


        image.filters = [
            // new PIXI.filters.BlurFilter(5, 5),
            // new PIXI.filters.NoiseFilter(.1)
            new PIXI.filters.DisplacementFilter(displacementImage, 20),
            rgbFilter
        ]

        // add image to app
        app.stage.addChild(image)
        app.stage.addChild(displacementImage)


        // auto displace
        // app.ticker.add(() => {
        //     displacementImage.x = displacementImage.x + 1
        //     displacementImage.y = displacementImage.y + 1
        // })
    })


    let currentX = 0
    let currentY = 0

    let aimX = 0
    let aimY = 0

    // mouseover events
    section.addEventListener("mousemove", function(event) {

        aimX = event.pageX
        aimY = event.pageY


        // displacementImage.x = event.pageX
        // displacementImage.y = event.pageY

    })

    section.addEventListener("touchmove", function(event) {

        aimX = event.pageX
        aimY = event.pageY


        // displacementImage.x = event.pageX
        // displacementImage.y = event.pageY

    })

    const animate = function () {
      const diffX = aimX - currentX
      const diffY = aimY - currentY

      currentX = currentX + (diffX * 0.02)
      currentY = currentY + (diffY * 0.02)

      if (displacementImage) {
        displacementImage.x = currentX
        displacementImage.y = displacementImage.y + 1 + (diffY * 0.01)

        rgbFilter.red = [diffX * 0.05, 0]
        rgbFilter.green = [0, diffY * 0.05]

      }

      requestAnimationFrame(animate)
    }

    animate()

})