##################################################################################
### A2J Author 5 * Justice * 正义 * công lý * правосудие                        ###
### All Contents Copyright The Center for Computer-Assisted Legal Instruction  ###
##################################################################################

2015-01-28

Description of configuration files to run the A2J 5 Viewer for desktop/mobile.

Folder structure:

viewer/
viewer/images


Files:

viewer/index.html - Landing page.

This would be the destination page when a user clicks a link to start a Guide Interview (GI).

It contains configuration options telling A2J which GI to load, answer file paths,
GI paths, etc.

The config is set by the server on a per GI/per user basis.

It determines whether mobile or desktop should be displayed and loads the actualy viewer for
that platform.


viewer/







2015-01-12

Mobile Viewer source code is in a separate repository: A2J5MV

