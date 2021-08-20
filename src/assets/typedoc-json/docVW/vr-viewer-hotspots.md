## VR-VIEWER-HOTSPOTS 

Hotspots are defined by creating point objects in your model with an attribute called `vr_hotspot`.
The position of the point object defines the location of the VR hotspot. The `vr_hotspot` `attribute
is a dictionary containing various settings. 

For standard hotspots, only one setting is required: the rotation of the camera. Here is an
example of a line of code setting the `vr_hotspot` attribute:

```
my_point@vr_hotspot = {
    "camera_rotation": 45
}
```

For panorama hotspots, additional settings are required for the panorama images. Here is an example
of a line of code setting the `vr_hotspot` attribute for a hotspot with both a forground and
background image:

```
my_point@vr_hotspot = {
    "background_url": "https://www.dropbox.com/s/xxxxxxxxxx/panorama1_back.jpg?dl=0",
    "background_rotation": 53,
    "foreground_url": "https://www.dropbox.com/s/xxxxxxxxxx/panorama1_front.jpg?dl=0",
    "foreground_rotation": 53,
    "camera_rotation": 0
}
```

The settings in the dictionary are as follows:
* `background_url`: The url of the background 360° panorama image, in `.png` format.
* `background_rotation`: The rotation of the background 360° panorama image.
* `foreground_url`: The url of the foreground 360° panorama image, in `.png` format..
* `foreground_rotation`: The rotation of the foreground 360° panorama image.
* `camera_rotation`: The rotation of the camera.

All angles are defined in degrees, relative to the Y axis. Positive angles rotate in a clockwise
direction when looking down at the XY plane; negative angles rotate in an anti-clockwise direction.

**Panorama Hotspots**

The panorama hotspot can include two panorama images: one for the foreground and another for the
background. These images form two domes, centered on the camera location. The 3D model
is placed at the dentre of these two domes. Below is a diagram of the setup:

![Two panorama images](assets/typedoc-json/docVW/imgs/viewer_vr_hemi_domes.png)

For the 360° panorama images, you can either have only a foreground image or you can have both a
foreground and a background image. In the foreground image, only the entities that appear infront of
the digital model should be kept. All other parts of the image should be cut and made transparent
using an image editing application. In addition, if the images contain any buildings will be
demolished, then these should also be deleted. Image editing applications such as Photoshop and Gimp
have specialised editing tools for 360 images that can be helpful.

Below is an example of a forground 360° panorama image (reduced resolution):

![Forground 360° panorama image](assets/typedoc-json/docVW/imgs/viewer_vr_foreground.png)

And here is the matching background 360° panorama image (reduced resolution)::

![Background 360° panorama image](assets/typedoc-json/docVW/imgs/viewer_vr_background.png)

**Creating Panorama Images With Your Phone**

The images for the panorama hotspots need to be saved in an online location. You can use any type of
online file storage that allows you to retrieve a URL that directly links to the image. For example,
Github or Dropbox both allow this.

Panorama images can be created using a phone app. There are various free apps available. One example
is the Google Street View app:
* [Google Street View App](https://play.google.com/store/apps/details?id=com.google.android.street)

When you make your own panorama images, you should record the exact location where the image was
taken. This location will be needed when you are placing a hotspot in the model.

**Downloading Panorama Images With SVD360**

Panorama images can also be downloaded from online sources and repositories. Here is a link to a
desktop application called SVD360 that can be used for downloading imgages from Google Street View:
* [Street View Download (SVD360)](https://svd360.istreetview.com/)

You can download one or more 360 image using SVD360 application as follows:
* In Google Maps, navigate to the Google Street view image that you want to download and copy the
  URL.
* In SVD360, go to the 'Tools' tab and paste the URL into the URL input box. This will give you the
  ID of the panorama image. 
* In SVD360, go to the 'Panorama Download' tab and specify the filename where the image should be
  save, paste the the panorama ID, and set the resolution to 2048 x 1024. Save the image in `.png`
  format.
* In SVD360, you will see the downloaded image, and also some data about the image. Save this data
  to a text file. In particular, you need to save the Geolocation and North Rotation. you need to
  save the `Geolocation` and `North Rotation`.

```
panorama1_lat = 1.277360
panorama1_long = 103.843542
panorama1_rot = 267
panorama1_back_url = "https://www.dropbox.com/s/xxxxxxxxxx/panorama1_back.jpg?dl=0"
```

**Creating a Panorama Hotspot**

In Mobius Modeller, you first need to create a script that defines a geolocation for the model.
Then, for each panorama image that you downloaded, you need to create a point object at the correct
longitude and latitude for the image. creates a hotspot point object. 
* In the Mobius script, create a model attribute that specifies the longitude and latitude of the
  model. 
* In the Mobius script, convert the latitude and longitude of each panorama image to an XYZ location
  the model coordinate system. 
* In the Mobius script, create a point object for each

Here is a snippet of code for the above steps:
```
@geolocation = {"latitude": 1.277, "longitude": 103.843, "elevation": 1}
panorama1_xyz = util.latLong2xyz(panorama1_lat, panorama1_long)
panorama1_posi = make.Position(panorama1_xyz)
panoram1_point = make.Point(panorama1_posi)
vr_hotspot_data = {}
vr_hotspot_data["background_url"] = panorama1_back_url,
vr_hotspot_data["background_rotation"] = panorama1_rot,
vr_hotspot_data["camera_rotation"] = 45
panoram1_point@vr_hotspot_data
```

