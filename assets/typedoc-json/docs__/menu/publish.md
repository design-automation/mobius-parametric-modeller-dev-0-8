## PUBLISH

Opens a dialog box for publishing your Mobius script.

When a script is published, it is uploaded to the cloud. This allows people on the internet to
interact with your script in various ways, such as changing the parameters and executing the script.
Note that when you publish your script, other people will also be able to download your script and
copy it.

When a mobius script is published, it is uploaded to the cloud. The first dialog box that opens up
allows you to select how you would like to upload your Mobius script. There are two options:
* _Upload to Cloud_: This will upload the currently open script to the Mobius cloud. The file will
  be saved in the cloud for one year, after which it will be automatically deleted. You will not be
  able to manually delete the file after it has been uploaded.
* _Use URL_: This will allow you to use a previously uploaded Mobius Script. (For example, you can
  upload your file to platforms such Github or Dropbox.) 

![Publish options](assets/typedoc-json/docUI/imgs/publish_start.png)

If you choose the 'Use URL' option, then a second dialog box pops up, allowing you to enter the URL.
Just paste your existing URL into the input box. The URL will then be validated, to make sure that
it points directly to a Mobius script file. 

![Validating a URL for publishing scripts](assets/typedoc-json/docUI/imgs/publish_url.png)

In the last dialog box, you generate a link for the uploaded file. For the link there are various
settings that you can define. For example, maybe you want a link that, when clicked, will open
Mobius Modeller and load your file, and also only show the dashboard and 3D viewer, hiding the
Flowchart and Editor panes. (This may be useful for people who want to see your model, but who do
not understand any of the coding behind it.)

There are two main modes: 'Explorer' and 'Developer'. 

**Explorer Mode**

If you you choose 'Explorer Mode', then the person looking at the published script will see a
simplified user interface. This user interface is designed for people who just want to explore your
script (changing parameters, executing the script, and viewing the results). The user interface does
not include the Flowchart pane or the Editor pane, so they will not see any of the code. The
'Explorer Mode' settings are shown below.

![Explorer Mode](assets/typedoc-json/docUI/imgs/publish_settings_explorer.png)

In 'Explorer Mode', you can set:
* _Show Viewers_: The viewers that are shown in the Mobius user interface. For example, if you only
  tick the CAD Viewer and the Console, then only those two viewers will be visible. The Geo and VR
  viewers will be hidden.
* _Active Viewer_: The viewer that is active. For example, if you want the person viewing your
  script to initially see the Console viewer open, then you can select the Console viewer from the
  list.

**Developer Mode**

If you choose 'Developer Mode', then the person looking at the published script will see the normal 
Mobius Modeller interface. The 'Developer Mode' settings are shown below.

![Developer Mode](assets/typedoc-json/docUI/imgs/publish_settings_developer.png)

In 'Developer Mode', you can set:
* _Active Pane_: The active scripting pane, either the Dashboard or the Editor. For example, if you
  want the person viewing your script to initially see the Editor pane open, then you can select
  'Editor' from the list.
* _Select Node_: The selected node in the flowchart. By default, the selected node will be the `End`
  node. The dropdown menu allows you to specify a different node to be selected. *_Active Viewer_:
  The viewer that is active. (Same as in Explorer mode.)

**Types of Links**

Finally, when generating your link, there are two options:
* _Create_Link_: Creates a URL link that you can share with other people, on social media or by
  email. People who follow the link will be able to interact with your published Mobius script.
* _Create Embed Code_: Creates a small snippet of code that can be embedded into another webpage,
  for example a blog. The embed code will result in a small embedded window (called an `iframe`) to
  be created. The size of the embedded window can be specified by editing the dimensions in the code
  snippet. The default is `width='100%' height='600px'`.