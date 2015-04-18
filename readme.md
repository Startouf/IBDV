# In-Browser Data Visualization

## What it is about ?

Two intensive weeks of work to discover and invent various techniques to represent data in a fashionable way in modern web browsers.

## Start the demo

Because it's designed to be ran with web browsers, just run Site/index.html with your favourite web browser.

However, if you want to run the 3D/4D visualisation, you need a browser that can run WebGL. Google Chrome has displayed very at the time we coded it, but new Firefox versions seem to also perform extremely well

## What has been done

### 2D Data visualizations

Some classic data representations were coded using the library d3.js

### An innovative 4D Data visualization

A more innovative approach was used to create a 4D data-visualization of meteorites falling on Earth, from the official database of crashes available on the web. 

Why 4D ? 

*  Classic 3D using webGL, an implementation of OpenGL that can be ran from compatible browsers
*  Time ! And it actually allows us to actually represent a lot more information without "overcrowding"

The 3D library three.js was used to create a webGL animation where one can see/rotate a 3D model of the Earth. 
Because we thought it would be boring and muddled [see some maps there](http://datavisualization.ch/inside/how-we-visualized-meteorite-impacts/). Some info on how it works, and how the data is represented

*  Position - Every meteorite is going to fall according to a vertical line (going through the center of the Earth)
*  Type of meteor - Different textures for meteorites of different material type
*  Mass of meteor - Different size for the meteorites of different mass (but actually the difference isn't visible, however a trick is explained later)

This actually doesn't allow us to represent information clearly. And if we wanted to display all these informations for ALL meteors in the dataset, it would become horrible

So instead, we're playing on the time variables : meteor crashes will be played from oldest to most recent

*  Subsets - Instead of loading/crashing/displaying every meteors at the same time, we process by chunk
  *  A chunk of meteorite is loaded => meteors can be seen static in orbit
  *  Meteorites fall at a constant rate : 2 meteor per second
  *  Once enough meteors have fallen, the screen is "cleaned" by removing a chunk of older meteors (and loading a new one)
*  Allows to represent mass more effectively. Instead of relying on the size of the openGL object, we introduce a "blast radius" that will get bigger (I believe the current model is a logarithm of the mass)

We also used animation effects to represent other information we had concerning the meteorites, and the user can see for example a blast radius that corresponds to the size of the meteor.

# Credits 

Main programmers

*  Céline Chen
*  Cyril Duchon-Doris
*  Edouard Epaud
*  Paul Catala

# Special thanks

*  Jean Le Feuvre - Animation Expert at Télécom ParisTech
*  Emmanouil Potetsianakis - Tutor & Multimedia Department at Télécom ParisTech