*This document describes how A2J author works at a high level. Please update this document as changes are made.*

## Summary
There is a client, server, and file storage; all of which sit behind an Apache server.

The client application `CAJA/js` is broken into two parts: the authoring application `CAJA/js/author` and standalone viewer `CAJA/js/viewer`. These apps share code but build and deploy as separate application. Both projects contain legacy jQuery code, which is to say code not written in CanJs.

The server application has two parts: the legacy PHP code and the newer NodeJs code. Most functionality including file management, uploads, and authentication are in PHP. The DAT (Document assembly tool) is written in Node. This code runs as a standalone server which proxies cookie headers to the PHP code for authentication.

The data layer is the filesystem. All interviews (guides) and templates are stored in a `userfiles/` directory which is partitioned by user and then by guide. For example, user `mike` has a guide with ID `123` which is stored as `userfiles/mike/guides/Guide123`. There is MySQL server which stores indexes into these files; it is rarely used and the files are the source of truth.

Each of these tiers has tech debt to be addressed. Moving forward with development, any changes in the legacy jQuery or PHP code should be coupled to refactoring those pieces into Can or Node code respectively. The MySQL database should not be utilized in new features and code involving it should be phased out. The ideal architecture is a single Node server hosting the CanJs client applications with data provided solely from the filesystem.

## Document assembly tool (DAT)
The Node server has two services: the template CRUD API which uses [Feathers](https://feathersjs.com/) and the assembly APIs which take the templates and variable answers to generate PDFs. The template API is REST-ish and the assembly API is RPC (remote procedure call; aka action-oriented). The assembly API is splintered by the two forms of template: rich text and PDF base. The rich text assembly utilizes [Done SSR](https://github.com/donejs/done-ssr) and [wkhtmltopdf](https://wkhtmltopdf.org/) to generate PDFs. The PDF base assembly uses [Hummus](https://github.com/galkahana/HummusJS) for overlaying variable answers on provided PDFs. There is also the unified PDF assembly which applies each assembly system to the respective templates and the combines them together into a single PDF.

The templates are JSON. Every template has a `rootNode` property. For rich text templates that `rootNode` contains sub nodes which build out to be a tree structure containing the content nodes such as paragraphs. For PDF base templates, the `rootNode` contains all options pertaining to the overlay which will be rendered out on top of the base PDF. These PDF templates will have alongside them in the `userfiles` a PDF with the same name but `.pdf` instead of `.json` extension. These PDF files are uploaded via the small `a2j-doc/storage` service.

