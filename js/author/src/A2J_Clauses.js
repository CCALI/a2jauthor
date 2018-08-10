/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	2015-03-30 Clauses/Clause library
	Behave like Variables but are effectively Constants.
	Also can contain conditionals.

*/
import { TGuide } from './viewer/A2J_Types'

function clauseEdit (clause /* TClause */) {	// 2015-03-27 Clause editor
  var fs = form.fieldset('Clause', clause)
  // $('#clausename').val(clause.name);
  // $('#clausecomment').val(clause.comment);
  trace(clause)
  fs.append(form.text({label: 'Name:',
    value: clause.name,
    change: function (newname, clause) {
      if (newname !== clause.name)// rename
      {
        delete gGuide.clauses[ clause.name.toLowerCase()]
        clause.name = newname
        gGuide.clauses[newname.toLowerCase()] = clause
      }
    }}))
  fs.append(form.text({label: 'Comment:', 	value: clause.comment, change: function (val, clause) { clause.comment = val }}))
  fs.append(form.htmlarea({ label: 'Text:',	value: clause.text,	change: function (val, clause) { clause.text = val }}))

  $('#clausefs').empty().append(fs)

  $('#clauseUsageList').html('...')
  $('#clauseusage').button({label: 'Quick Find', icons: {primary: 'ui-icon-link'}}).click(function () {	// 2015-03-27 List all references to this clause.
    $('#clauseUsageList').html(vcGatherUsage(c.name))
  })
  $('#clause-edit-form').data(clause).dialog({
    autoOpen: true,
    dialogClass: 'modal bootstrap-styles',
    width: 800,
    height: 500,
    modal: true,
    close: function () {
    },
    buttons: [
      {text: 'Delete',
        click: function () {
          var name = $(this).data().name
          if (name === '') {
            return
          }
          dialogConfirmYesNo({title: 'Delete clause ' + name,
            message: 'Delete this clause?',
            name: name,
            Yes:
				/** * @this {{name}} */
				function () {
				  $('#clause-edit-form').dialog('close')
				  gGuide.clauseDelete(this.name)
				}})
        }},
      {text: 'Close',
        click: function () {
        // var name= clause.name; // $('#clausename').val();
        // if(name!==c.name)//rename variable
        // {
        //	delete gGuide.clauses[ c.name.toLowerCase()];
        //	c.name=name;
        //	gGuide.clauses[name.toLowerCase()]=c;
        // }
        // c.comment=$('#clausecomment').val();
          gGuide.noviceTab('tabsClauses', true)
          $(this).dialog('close')
			 }}
    ]})
}

export function clauseAdd () { // Add new clause and edit.
  var c = new TClause()
  clauseEdit(c)
}

TGuide.prototype.clauseDelete = function (name) {
  var guide = this
  delete guide.clauses[name.toLowerCase()]
  gGuide.noviceTab('tabsClauses', true)
}

TGuide.prototype.clauseListHTML = function () {	// Build HTML table of clauses, nicely sorted.
  var guide = this
  var th = html.rowheading(['Name', 'Comment', 'Content'])
  var sortclauses = guide.clausesSorted()
  var ci
  var tb = ''
  for (ci in sortclauses) {
    var c = sortclauses[ ci ]
    tb += html.row([ c.name, c.comment, c.text ])
  }
  return '<table class="A2JClauses">' + th + '<tbody>' + tb + '</tbody>' + '</table>'
}

TGuide.prototype.buildTabClauses = function (t) {
  t.append(this.clauseListHTML())
  $('tr', t).click(function () {
    clauseEdit(gGuide.clauses[$('td:first', this).text().toLowerCase()])
  })
}
