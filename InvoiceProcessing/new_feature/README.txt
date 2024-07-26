1. Install lxml
$ pip install lxml

2. Create invoice.xml from invoice.xml.b (backup file)
$ cp invoice.xml.b invoice.xml

3. Run transfer_invoice.py
$ python transfer_invoice.py transfer_xml2ubl.xslt invoice.xml

4. Get the result of xml file in ubl format
$ ls 
-> ubl_invoice.xml

(5.) Additional, you can delete the origin xml file
comment out the line from line 18 to 22.