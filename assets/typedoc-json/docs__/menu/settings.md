## SETTINGS

Opens a dialog box to set various Mobius settings.

* Execute on file load: If enabled, Mobius script files will be executed automatically after they
  are loaded.
* Auto-save after executing: If enabled, Mobius script files will be automatically saved to Local
  Storage after they are executed. This means that any changes you have made since the last
  execution will be saved and backed up. 
* Display Mobius Functions: Shows a list of all the categories of the functions in Mobius. For each
  category, if it is enabled, then the functions in that category will be visible in the left
  vertical menu in the Editor pane.`

**Setting Up Hardware Acceleration**

At the bottom of the setting dialog box, you will see the hardware that you have available for WebGL
rendering. For example, if you have an NVIDIA GEForce graphics card, it will show the details of
that card.

Mobius renders and displays 3D models using a library called
[WebGL](https://www.khronos.org/webgl/). This WebGL library can either use software rendering or
hardware rendering. 

Hardware rendering will give you a significant performance boost. So it is important that your 
browser is set to use hardware rendering. 

To check if you are using hradware acceleration, copy-and-paste the following into the URL address 
bar:
  * `chrome://gpu/`
  * `edge://gpu/`
  * `opera://gpu/`
  * `brave://gpu/`

You should see that `WebGL` and `WebGL2` are set to `Hardware accelerated`. For the Chrome browser, 
here an example of what you should see.

![Verifying that WebGL is using hardware in
Chrome](assets/typedoc-json/docUI/imgs/menu_chrome_gpu.png)

If WebGL is not set to `Hardware accelerated`, please check out this site: [setting WebGL to use
hardware
acceleration](https://support.biodigital.com/hc/en-us/articles/218322977-How-to-turn-on-WebGL-in-my-browser).
Or Google it for more information.

**Setting Up Your Graphics Card**

If you are using a laptop, then you may have two graphics cards. High-end laptops will often have 
an integrated graphics card and a high performance graphics card. 

The high performance graphics card (such as NVIDIA, Broadcom, AMD etc) will use more power, and 
will therefore drain your battery more quickly. Laptops will usually have default settings for 
browser to to use the integrated graphics, to save on battery. However, in order to get the best 
performance out of Mobius, you should change the default settings for your browser to use your 
high-performance graphics card.

How to do this will depends on your graphics card, so you may need to Google it. For NVIDIA, you 
can open the NVIDIA Control Panel on you laptop, and go to `Manage 3D settings > Program Settings` 
as shown in the image below. In this example, we set `Google Chrome` to use the `High-performance 
NVIDIA processor`.

![Setting the video card for the Chrome browser](assets/typedoc-json/docUI/imgs/menu_nvidia.png)