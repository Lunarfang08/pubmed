from lxml import etree

def parse_pubmed(xml_text):
    root = etree.fromstring(xml_text.encode())

    papers = []

    for article in root.xpath("//PubmedArticle"):

        pmid = article.xpath(".//PMID/text()")
        title = article.xpath(".//ArticleTitle/text()")
        abstract = article.xpath(".//AbstractText/text()")

        pmid = pmid[0] if pmid else None
        title = title[0] if title else ""
        abstract = " ".join(abstract) if abstract else ""

        authors = []
        for a in article.xpath(".//Author"):
            first = a.xpath("./ForeName/text()")
            last = a.xpath("./LastName/text()")
            if last:
                authors.append(f"{first[0] if first else ''} {last[0]}")

        mesh_terms = [
            m.xpath("./DescriptorName/text()")[0]
            for m in article.xpath(".//MeshHeading")
            if m.xpath("./DescriptorName/text()")
        ]

        papers.append({
            "pmid": pmid,
            "title": title,
            "abstract": abstract,
            "authors": authors,
            "mesh_terms": mesh_terms
        })

    return papers