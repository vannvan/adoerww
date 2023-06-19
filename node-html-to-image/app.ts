console.log('hello world')

// import nodeHtmlToImage from 'node-html-to-image'
const nodeHtmlToImage = require('node-html-to-image')

nodeHtmlToImage({
  output: './image.png',
  html: `<html>
    <head>
      <style>
        body {
          width: 1000px;
          height: 800px;
          color: #f00;
          font-size: 150px
        }
      </style>
    </head>
    <body>Hello world!</body>
  </html>
  `,
}).then(() => console.log('The image was created successfully!'))
