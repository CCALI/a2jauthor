Templates previously relied on an index map (`templates.json`) of `guideId` to `templateId` at the user root in the file system, but also had a local `templates.json` for each guide to use in standalone document assembly:

```
<filesRoot>
  <mikem>
     |__ templates.json  // [ {"guideId": "600", "templateId": 1}, {"guideId": "843", "templateId": 11}, ...]
     |__ <guides>
           |__ Guide600
             |__ templates.json { "1":{"guideId":"600","templateId":1}, "2":{"guideId":"600","templateId":2}, ...}
           |__ Guide843
             |__ templates.json { "11":{"guideId":"843","templateId":11} }
```

This worked fine for text only templates in Author for both test assemblies and during the upload of a GI. However, as templateIds were unique, when uploading a GI to Author it would capture the current template json data, re-post that data to the templates API to re-register it as new, and then delete the old template, finally updating the user's master templates.json index, mapping each newly generated templateId to the newly uploaded guideId.

This caused several issues with the addition of PDF based templates which are a matched named pair of `.json` and `.pdf` file (example: `template13.json`, `template13.pdf`), as you now needed to not only re-create/re-register the `.json` template file, but also re-name the associated `.pdf` file to match it's new `templateId` generated by the API. This caused a lot of extra bookkeeping between the front and backend, in both Node and PHP, making it difficult for a Guided Interview to be shared, published, or used in standalone Viewer/DAT environments.

Now the local `templates.json` file is the single source of truth for mapping the local `guideId` to the list of `templateIds` that belong to it, in the order they should be displayed/assembled:

```
<filesRoot>
  <mikem>
    <guides>
       |__ Guide600
            |__ templates.json { "guideId":"600","templateIds": [1, 2] }
```

This puts everything that matters to the Guided Interview in the GI itself when zipped for sharing/publishing, and allows it to work the same in a full Author environment as well as a standalone self-hosted A2J-Viewer/A2J-DAT environment.
