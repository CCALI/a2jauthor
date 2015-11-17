import $ from 'jquery';
import _keys from 'lodash/object/keys';
import _find from 'lodash/collection/find';
import Answers from 'viewer/models/answers';
import constants from 'viewer/models/constants';
import cString from 'viewer/mobile/util/string';
import _forEach from 'lodash/collection/forEach';

let variableToField = function(varName, pages) {
  let field;

  _forEach(_keys(pages), function(pageName) {
    let page = pages[pageName];

    field = _find(page.fields, function(field) {
      return field.name.toLowerCase() === varName.toLowerCase();
    });

    // early exit of the iteration if field found.
    if (field) return false;
  });

  return field;
};

let setVariable = function(variable, pages) {
  var varType;
  var field = variableToField(variable.name, pages);

  if (field == null) {
    varType = variable.type;
  } else {
    varType = cString.fieldTypeToVariableType(field.type);
  }

  var mapVar2ANX = {};

  mapVar2ANX[constants.vtUnknown] = 'Unknown';
  mapVar2ANX[constants.vtText] = 'TextValue';
  mapVar2ANX[constants.vtTF] = 'TFValue';
  mapVar2ANX[constants.vtMC] = 'MCValue';
  mapVar2ANX[constants.vtNumber] = 'NumValue';
  mapVar2ANX[constants.vtDate] = 'DateValue';
  mapVar2ANX[constants.vtOther] = 'OtherValue';

  var ansType = mapVar2ANX[varType];

  // Type unknown possible with a Looping variable like CHILD
  if (ansType === constants.vtUnknown || ansType == null) {
    ansType = [constants.vtText];
  }

  var getXMLValue = function(value) {
    if (varType === constants.vtDate) {
      // Ensure our m/d/y is converted to HotDocs d/m/y
      value = cString.mdyTodmy(value);
    }

    var xmlV;
    if (typeof value === 'undefined' || value === null || value === '') {
      // 2014-06-02 SJG Blank value for Repeating variables MUST be in answer file (acting as placeholders.)
      xmlV = '<' + ansType + ' UNANS="true">' + '</' + ansType + '>';
    } else {
      xmlV = '<' + ansType + '>' + cString.htmlEscape(value) + '</' + ansType + '>';
    }

    if (varType === constants.vtMC) {
      xmlV = '<SelValue>' + xmlV + '</SelValue>';
    }

    return xmlV;
  };

  var xml = '';
  if (variable.repeating === true) {
    // Repeating variables are nested in RptValue tag.
    for (var i = 1; i < variable.values.length; i++) {
      xml += getXMLValue(variable.values[i]);
    }

    xml = '<RptValue>' + xml + '</RptValue>';
  } else {
    var value = variable.values[1];
    if (!(typeof value === 'undefined' || value === null || value === '')) {
      // 2014-06-02 SJG Blank value for non-repeating must NOT be in the answer file.
      xml = getXMLValue(value);
    }
  }

  if (xml !== '') {
    xml = '<Answer name="' + variable.name + '">' + xml + '</Answer>';
  }

  return xml;
};

export default {
  parseANX(json, pages) {
    var xml = constants.HotDocsANXHeader_UTF8_str;
    xml += '<AnswerSet title="">';

    for (var k in json) {
      xml += setVariable(json[k], pages);
    }

    xml += '</AnswerSet>';

    return xml;
  },

  // 11/13 Parse HotDocs answer file XML string into guide's variables.
  // Add to existing variables. Do NOT override variable types.
  parseJSON: function(answersXML, vars) {
    var mapANX2Var = {
      unknown: constants.vtUnknown,
      textvalue: constants.vtText,
      tfvalue: constants.vtTF,
      mcvalue: constants.vtMC,
      numvalue: constants.vtNumber,
      datevalue: constants.vtDate,
      othervalue: constants.vtOther,
      rptvalue: constants.vtUnknown
    };

    var guide = new Answers(vars);

    $(answersXML).find('answer').each(function() {
      var varName = cString.makestr($(this).attr('name'));

      // 12/03/2013 Do not allow # in variable names.
      if (varName.indexOf('#') !== -1) return;

      var v = guide.varExists(varName);
      var varANXType = $(this).children().get(0).tagName.toLowerCase();
      var varType = mapANX2Var[varANXType];

      // Variables not defined in the interview should be added in case
      // we're passing variables between interviews.
      if (v == null) {
        v = guide.varCreate(varName, varType, false, '');
      }

      switch (varANXType) {
        case 'textvalue':
          guide.varSet(varName, $(this).find('TextValue').html());
          break;

        case 'numvalue':
          guide.varSet(varName, +$(this).find('NumValue').html());
          break;

        case 'tfvalue':
          guide.varSet(varName, !!$(this).find('TFValue').html());
          break;

        case 'datevalue':
          guide.varSet(varName, $(this).find('DateValue').html());
          break;

        case 'mcvalue':
          guide.varSet(varName, $(this).find('MCValue > SelValue').html());
          break;

        case 'rptvalue':
          v.attr('repeating', true);

          $('rptvalue', this).children().each(function(i) {
            varANXType = $(this).get(0).tagName.toLowerCase();
            varType = mapANX2Var[varANXType];

            switch (varANXType) {
              case 'textvalue':
              case 'numvalue':
              case 'tfvalue':
              case 'datevalue':
                guide.varSet(varName, $(this).html(), i + 1);
                break;

              case 'mcvalue':
                guide.varSet(varName, $(this).find('SelValue').html());
                break;
            }
          });

          break;
      }

      if (v.attr('type') === constants.vtUnknown) {
        v.attr('type', varType);

        if (v.attr('type') === constants.vtUnknown) {
          varName = varName.split(' ');
          varName = varName[varName.length - 1];

          if (varName === 'MC') {
            v.attr('type', constants.vtMC);
          } else if (varName === 'TF') {
            v.attr('type', constants.vtTF);
          } else if (varName === 'NU') {
            v.attr('type', constants.vtNumber);
          } else {
            v.attr('type', constants.vtText);
          }
        }
      }
    });

    return guide.serialize();
  }
}
