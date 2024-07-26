<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
                xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
                xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2">

    <xsl:output method="xml" indent="yes"/>
    
    <xsl:template match="/">
        <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
            <cbc:ID>
                <xsl:value-of select="Invoice/InvoiceNumber"/>
            </cbc:ID>
            <cbc:IssueDate>
                <xsl:value-of select="Invoice/InvoiceDate"/>
            </cbc:IssueDate>
            <cac:AccountingCustomerParty>
                <cac:Party>
                    <cac:PartyName>
                        <cbc:Name>
                            <xsl:value-of select="Invoice/Customer/Name"/>
                        </cbc:Name>
                    </cac:PartyName>
                    <cac:PostalAddress>
                        <cbc:StreetName>
                            <xsl:value-of select="Invoice/Customer/Address"/>
                        </cbc:StreetName>
                    </cac:PostalAddress>
                </cac:Party>
            </cac:AccountingCustomerParty>
            <cac:InvoiceLine>
                <cbc:ID>1</cbc:ID>
                <cbc:InvoicedQuantity>
                    <xsl:value-of select="Invoice/Item/Quantity"/>
                </cbc:InvoicedQuantity>
                <cbc:LineExtensionAmount currencyID="AUD">
                    <xsl:value-of select="number(Invoice/Item/Quantity) * number(Invoice/Item/Price)"/>
                </cbc:LineExtensionAmount>
                <cac:Item>
                    <cbc:Description>
                        <xsl:value-of select="Invoice/Item/Description"/>
                    </cbc:Description>
                </cac:Item>
                <cac:Price>
                    <cbc:PriceAmount currencyID="AUD">
                        <xsl:value-of select="Invoice/Item/Price"/>
                    </cbc:PriceAmount>
                </cac:Price>
            </cac:InvoiceLine>
        </Invoice>
    </xsl:template>

</xsl:stylesheet>