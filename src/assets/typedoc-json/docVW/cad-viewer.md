
## CAD-Viewer  
  
The CAD Viewer allows you to view 3D models and associated attribute data.

* Rotate view: Left click and drag.
* Pan view: Right click and drag.
* Zoom in/out: Scroll with mouse wheel (or two-finger on touch-pad).
* Select Entity: Left click on entity.

![CAD Viewer](assets/typedoc-json/docVW/imgs/viewer_cad_sml.png)

In the top-right corner:
* _Settings_: Opens the settings dialog box on the left side.
* _Zoom to Fit_: Moves the camera to fit the model in the view.
* _Select_: A drop down to specify the types of entities to select.

In the bottom right-hand corner:
* A toggle button to change the camera between 'Perspective', 'Top', 'Left', and 'Front' views.

**Zoom to Fit**

Clicking the 'Zoom to Fit' button when no entities are selected will move the camera so tha the whole model fits in the view. 

Clicking the 'Zoom to Fit' button when an entity is selected will move the camera so tha the selected entity fits in the view. 

In both cases, zooming will also move the origin of rotation. For example, if you select an entity, and then click the 'Zoom to Fit' button, then the view gets zoomed to that entity. In addition the view rotation centre point will also be reset to the centroid of that entity. this means that when you rotate the view using 'left mouse button and drag', the view will rotate around the selected entity.

![Zoom selected](assets/typedoc-json/docVW/imgs/viewer_cad_zoom_selected_sml.png)

**Selecting Entities**

Selecting entities allow you to:
* 'Zoom Fit' the selected entities.
* See the ID of the selected entity.
* See the attributes of the selected entities.

The `Select` button opens up a dropdown menu, allowing you to specify the types of entities that can be selected with the left-click mouse action. 

![Select entities dropdown menu](assets/typedoc-json/docVW/imgs/viewer_cad_select_dropdown.png)

The default options are as follows:
* `co`: Select collections
* `pt`: Select point objects
* `pl`: Select polyline objects
* `pg`: Select polygon objects
* `ps`: Select positions.

For example, is you select `pg`, then left clicking on entities in the model select polygons. If you select `ps`, then left clicking will select positions. In the image below, the same polygon was clicked two times: on the left, the 'Select' dropdown was set to `pg`, on the right the dropdown was set to `ps`.

![Select polygons versus positions](assets/typedoc-json/docVW/imgs/viewer_cad_select_pg_ps.png)

If you left-click and no such entity exists, then a message will popup. For example, let's say you have specified `pl` in the 'Select' dropdown. If you click a polyline, then it will become selected. But if you click a polygon, then a message will popup, stating `Selection is not a polyline`.

![Select entities message](assets/typedoc-json/docVW/imgs/viewer_cad_select_not_pl.png)

Holding down the `Ctrl` OF `Shift` key will allow you to select multiple entities. Left-clicking a selected entity will deselect that entity.

The options that are shown on the 'Select' dropdown can be set in the viewer settings. This is explained in more detail below.

**Attribute Table**

The CAD viewer is split horizontally into two parts. The top part shows the 3D model, while the bottom parts shows the attributes tables. 

The attribute table has a series of tabs:
* _Model_: Attributes for the whole model.
* _Collections_: Attributes for collections of objects in the model.
* _Objects_: Attributes for points, polylines, and polygons in the model. Clicking the tab will show a dropdown menu, where you can select either 'Points', 'Polylines' or 'Polygons'.
* _Sub-entities_: Attributes for sub-entities, in either collections or objects. You must first select the entity for which you want to show sub-entities.
* _Positions_: Attributes for positions in the model.

Selecting the _Model_ tab will show all the model attributes in the model. For this table, each row in the table represents a different attribute. (In the other tables, attributes are organized in columns.) The table consist of two columns. The left column is the attribute name, and the right column is the attribute value.

For the collections, objects, and positions, selecting the tab will show a table where rows represents a geometric entity and columns represent attributes. For each attribute, the name is shown in the column header.

Below is an example of a set of attributes for polygons. In this case, the script has created 5 polygon attributes: `area`, `rel_height`, `rel_area`, `percent_area`, and `num_floors`. 

![An example of polygon attributes](assets/typedoc-json/docVW/imgs/viewer_cad_pg_attribs.png)

**Selecting in the Attribute Table**

When you select an entity in the 3D viewer, the entity in the attribute table also becomes selected. The reverse is also true. When you select a row in the attribute table, the entity in the 3D model also becomes selected. Similar to the 3D model, you can select multiple rows by holding down the `Ctrl` or `Shift` key. 

At the bottom of the attribute table, there is also a `Show selected` setting. When this setting is enabled, then the attribute table will only show selected entities. In the example above, we can see that `pg48` is selected in both the 3D model and the attribute table for polygons.

**Sorting in the Attribute Table**

In the attribute table, the rows can be sorted according to any of the attribute values. If you hover over the attribute name in the column header, then you will see a small arrow appear. You can toggle the arrow between three states:
* _Up arrow_: Sort table rows in descending order.
* _Down arrow_: Sort table rows in ascending order.
* _No arrow_: Do not sort.

In the example below, you can see that the entities in the polygon table have been sorted by the `area` attribute in descending order. You can now see that the polygon IDs are no longer in order (`pg54`, `pg45`, `ph61`, etc). The first row in the table is the polygon with ID `pg54`, and this is the polygon with the largest `area` value.

![Sorting entities by attribute value](assets/typedoc-json/docVW/imgs/viewer_cad_sort_attribs.png)

**Showing Attributes in 3D**

It is often useful to see attribute values in the 3D model. Next to the attribute name in the column header, you will see a small 'eye` icon. Clicking this icon allows you to enable and disable the display of attributes in the 3D viewer. 
* _Enabled_: For selected entities, attribute values will be shown in the 3D viewer. 

In the example below, you can see that the 'eye' toggle for the polygon `area` attribute has been switched on. Two polygons are selected in the 3D viewer, and for each selected polygon, the value of the `area` attribute is displayed. 

![Showing attribute values in 3D](assets/typedoc-json/docVW/imgs/viewer_cad_3d_attribs.png)

**Drilling Down to Sub-entities**

The sub-entities tab allows you to drill down into either collections or objects. In order to see the sub-entities for collections or objects, you need to make sure to first select the parent entity, which can either be a collection or an object.

The sub-entities are as follows:
* _Collections_: Sub-entities can consist of objects (points, polylines, polygons) and other collections.
* Points: Sub-entities consist of topological entities (vertices) and positions. 
* Polylines: Sub-entities consist of topological entities (vertices, edges) and positions. 
* Polygons: Sub-entities consist of topological entities (vertices, edges, wires) and positions.

Note that for topological sub-entities (vertices, edges, wires), the IDs are defined as follows:
* Vertex IDs start with `_v`
* Edge IDs with `_e`
* Wire IDs with `_w`

![Sub-entities of a polygon](assets/typedoc-json/docVW/imgs/viewer_cad_attribs_subentities.png)

above is an example of the topological sub-entities of a four-sided polygon. The sub-entities are as follows:
* The polygon ID is `pg48`
* The polygon has a single wire, `_w48`
* The wire has a sequence of edges, vertices, and positions:
 * 4 edges: `_e241`, `_e242`, `_e243`, `_e244`. Each edge has two vertices.
 * 4 vertices: `_v241`, `_v242`, `_v243`, `_v244`. Each vertex has one position.
 * 4 positions: `ps44`, `ps137`, `ps138`, `ps91`.

![Relationship between topological entities](assets/typedoc-json/docVW/imgs/viewer_cad_topology.png)

 The ordering and indentation in the attribute tables indicates how sub-entities are connected. In the example above,   edge `_e241` starts at vertex `_v241` and ends at vertex `_v242`. Vertex `_v241` is connected to `ps44`, and vertex `_v242` is connected to `ps137`.

 Topological sub-entities can only be selected in the attribute table. Selecting the row in the sub-entities table will also select the topological sub-entity in the 3D viewer. In the example below, `_v241` has been selected. 

 ![Selecting sub-entities](assets/typedoc-json/docVW/imgs/viewer_cad_attribs_subentities_select.png)

**Heads Up Display (HUD)**

The viewer supports a simple type of heads-up display (HUD), consisting of text that is displayed in the top-left corner of the viewer. This text is unaffected by the camera orientation. 

A HUD is created by defining a model attribute with the name `hud`, and with a value that is the text to be displayed. Below is an example of a HUD model attribute. As can be seen, the text specifies the required floor area and the actual floor area achieved. Note the use of the `\n` new-line character to create new lines. 

 ![Heads-up display](assets/typedoc-json/docVW/imgs/viewer_cad_hud.png)

 It is also possible to use HTML formatting in the HUD text.

**CAD Viewer Settings**

The settings for the CAD Viewer can be accessed by the 'gear' icon in the top right-hand corner of the viewer. The settings has five tabs:
* Scene: Scene settings, including axes, camera, and grid settings.
* Colors: Colors for various types of entities in the scene.
* Light & Shadow: Settings for the ambient light, hemisphere light, and directional light.
* Environment: Settings for the ground plane.
* Selection: Settings for the types of entities to show in the 'Select' dropdown menu. (Note that if zero or one entities is selected, then the 'Select' dropdown menu will be hidden.)



  