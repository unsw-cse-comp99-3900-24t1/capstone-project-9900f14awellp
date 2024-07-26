from lxml import etree
import sys
import os

def main(xslt, invoice_ubl):
    xml_input =  invoice_ubl
    xslt_input = xslt

    xml_file = etree.parse(xml_input)
    xslt_file = etree.parse(xslt_input)

    transfer = etree.XSLT(xslt_file)
    ubl_file = transfer(xml_file)

    with open('ubl_invoice.xml', 'wb') as f:
        f.write(etree.tostring(ubl_file, pretty_print=True, xml_declaration=True, encoding='UTF-8'))

    # try :
    #     os.remove(invoice_ubl)
    #     print(f'Successfully deleted {invoice_ubl}')
    # except Exception as e:
    #     print(f'Error: {e}')

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print(f'usage: python transfer_invoice.py [xslt] [invoice.xml]')
        sys.exit(1)

    main(sys.argv[1], sys.argv[2])
