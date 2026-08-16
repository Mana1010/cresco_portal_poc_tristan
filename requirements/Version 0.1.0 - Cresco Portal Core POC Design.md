## General Instructions
The Cresco_Platform_POC_V3_1_11.html file in the requirements folder is an already existing standalone POC (Proof of Concept). The objective for that is to show the initial vision and design of what the Portal Core should look like. 

For this POC, we need to prove that this design can be developed using Frappe Framework and by extension, VueJS and Tailwind CSS.

The following are general instructions to be followed for this version:
1. The HTML file already contains some data. That data should automatically be imported into the doctypes described in the next section as part of this version.
2. Field types should be determined from the data in those fields embedded in the HTML. For example: Tier field from the Project doctype may have the values Green, Blue, Red, Amber, just based on the data.
3. Use the remote repository https://github.com/tonancheta/cresco_portal_poc for this project

## DocTypes
Each screenshot in this section contains marked areas which represents fields needed for respective doctype.

### Project
![[Pasted image 20260807153257.png]]

![[Pasted image 20260807153411.png]]

#### Notes: 
- Client field links with the Client doctype (see below).
- Owner field links with the Staff doctype (see below).

### Project Deliverable
![[Pasted image 20260807153810.png]]

This is a child doctype of Project.

### Project Document Register
![[Pasted image 20260807153947.png]]

This is a child doctype of Project. Aside from the fields marked above, include a field type Attach with label "Attachment".

### Project Transmittal
![[Pasted image 20260807155037.png]]

This is a child doctype of Project.

### Client
No screenshot. For now fields should be:
- ID
- Client Name
- Address 1
- Address 2
- City
- State
- Zip Code
- Country

### Staff
![[Pasted image 20260807173018.png]]

#### Fields:
- Name
- Position
- Lens. Possible values: None, Cost, Time, Quality, Scale

### [[#Risk Register | Risk Register]]

^b5617b

![[Pasted image 20260807155306.png]]



## Portal Pages
This section describes the portal pages that needs to be created that's in scope for this version. Must follow the guidelines found [HERE](https://docs.frappe.io/framework/user/en/portal-pages). Use Vue 3 and Tailwind CSS for the development of these pages.

The first subsection contains labels for the different parts of the web page. These labels will be used throughout the remainder of this document. Each subsequent subsection contains description of what will be developed for this version of the POC.

### Parts of the Web Page

![[Pasted image 20260807153143.png|697]]

### Projects
![[Pasted image 20260807173706.png]]

#### Notes:
- Clicking on any part of the row in the Data Area will open the Project Detail page (see below).

### Project Detail - Overview tab
![[Pasted image 20260807180721.png]]

### Project Detail - Documents tab
![[Pasted image 20260807185608.png]]

### Risk Register
See [[#^b5617b | Risk Register]] above.