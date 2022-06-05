const fs = require('fs');
const  { promisify } = 'util';
const  path = require('path');
const unlink = promisify(fs.unlink);
const im = require('imagemagick');

export const reSizeImage = async (file) => {
  
  const tempLocalPath = `/tmp/${path.parse(file.name).base}`;
  const tempResizePath = `/tmp/${path.parse(file.name).base}-small`;

  try {
    await file.download({destination: tempLocalPath});
    console.log(`Downloaded ${file.name} to ${tempLocalPath}.`);
  } catch (err) {
    throw new Error(`File download failed: ${err}`);
  }
  let fileName = file.name.replace("logosRaw/", "logos/");
  let fileNameSmall = fileName + "-small"
  let fileNameMedium = fileName + "-medium"


  let svgResize = {
      srcData: fs.readFileSync(tempLocalPath, 'binary'),
      format:  'svg',
      width: 80
    }
  
    let svgStatus = await new Promise((resolve, reject) => { im.resize(svgResize, async function(err, stdout, stderr){
              if (err) throw err;
              fs.writeFileSync(tempResizePath, stdout, 'utf8');
              console.log('resized image to ' + svgResize.width + 'px and converted to svg');
              await uploadFile (fileNameSmall, tempResizePath, 'clicktrain-logos', '.svg', resolve, reject)
          
          });
      })   
      
      svgResize.width = 100

      let svgStatus2 = await new Promise((resolve, reject) => { im.resize(svgResize, async function(err, stdout, stderr){
        if (err) throw err;
        fs.writeFileSync(tempResizePath, stdout, 'utf8');
        console.log('resized image to ' + svgResize.width + 'px and converted to svg');
        await uploadFile (fileNameMedium, tempResizePath, 'clicktrain-logos', '.svg', resolve, reject)
    
    });
})   
   let pngResize = {
      srcPath: tempLocalPath,
      dstPath: tempResizePath,
      format:  'png',
      width: 80
    }
       
    let pngStatus = await new Promise((resolve, reject) => { im.resize(pngResize, async function(err, stdout, stderr){
              if (err) throw err;
              console.log('resized image to ' + pngResize.width + 'px and converted to png');
           
              await uploadFile (fileNameSmall, tempResizePath, 'clicktrain-logos', '.png', resolve, reject)
              
          });   
      })   

       pngResize.width = 100
      let pngStatus2 = await new Promise((resolve, reject) => { im.resize(pngResize, async function(err, stdout, stderr){
        if (err) throw err;
        console.log('resized image to ' + pngResize.width + 'px and converted to png');
     
        await uploadFile (fileNameMedium, tempResizePath, 'clicktrain-logos', '.png', resolve, reject)
        
    });   
})   
      unlink(tempLocalPath);
      unlink(tempResizePath);
      console.log("svg: " + svgStatus)
      console.log("png: " + pngStatus)
      console.log("svg: " + svgStatus2)
      console.log("png: " + pngStatus2)
      if (svgStatus && pngStatus && svgStatus2 && pngStatus2){
        return "ok"
      } else {
        let err = "Image resize failed"
        throw err
      }

}


