/**
 * This node js script scans through the input component template files and tidy's them according to our guidelines.
 *
 * https://jobs2careers.atlassian.net/wiki/spaces/EN/pages/122224724/Angular+Guidelines
 * https://jobs2careers.atlassian.net/wiki/spaces/ODT/pages/153354241/ODT+UI+Best+Practices
 *
 * Sample shell command:
 * node tidy-templates.js src/app
 *
 * To disable lint for a template add this comment to the top of the file:
 * <!-- tidy-templates: disable -->
 *
 * Derived from:
 * https://github.com/dave-kennedy/clean-html/blob/master/index.js
 *
 * TODO:
 * Detect "Else" Templates
 * Prefer ng-container for empty divs
 * Mark Localizable Text (in templates) with data-i19n
 */

const fs = require('fs');
const glob = require("glob");
const HtmlParser = require("htmlparser2");
const DomUtils = HtmlParser.DomUtils;

const CONSTANTS = {
  CR: '\r',
  LF: '\n',
  CRLF: '\r\n',
  ONE_WAY_BINDING_REGEX: new RegExp('^\\[([^(\\]]+)\\]$'),
  EVENT_BINDING_REGEX:   new RegExp('^\\(([^)]+)\\)$'),
  TWO_WAY_BINDING_REGEX: new RegExp('^\\[\\(([^)\\]]+)\\)\\]$'),
  QUOTED_STRING_REGEX:   new RegExp('^\'([^\']+)\'$'),
  EXPRESSION_REGEX:      new RegExp('^{{([^}]+)}}$'),
};

const opt = {
  attribute: {
    // List of attribute names whose value should be always be added even if empty.
    // Otherwise by default the attribute value (="") will be omitted when empty.
    emptyValueNames: [],

    // Number of attributes at which attribute indentation should start, or null if wrapping should never happen
    indentLengthThreshold: 2,

    // Alphabetical sorting flag, true for ascending order, false for descending order, null to disable
    alphaSort: true,

    // List of regular expressions that update the attribute order, unmatched values will be added afterwards
    orderRegex: [
      '^\\*.',                         // asteriskDirectives (aka structural directives)
      '^#',                            // id
      '^type$',                        // type
      '^formControlName$',             // otherDirectives
      '^j2cCurrencyInput$',            // otherDirectives
      '^j2cEmailValidator$',           // otherDirectives
      '^j2cCreditCardNumber$',         // otherDirectives
      '^j2cCreditCardCvn$',            // otherDirectives
      '^j2cCreditCardExpiry$',         // otherDirectives
      '^j2cSelectionRecall$',          // otherDirectives
      '^matInput$',                    // otherDirectives
      '^matColumnDef$',                // otherDirectives
      '^matSort$',                     // otherDirectives
      '^matTooltip$',                  // otherDirectives
      '^froalaEditor$',                // otherDirectives
      '^froalaView$',                  // otherDirectives
      '^let-',                         // otherDirectives
                                       // stringInitialization (?)
      CONSTANTS.ONE_WAY_BINDING_REGEX, // propertyBinding
      CONSTANTS.EVENT_BINDING_REGEX,   // eventBinding
      CONSTANTS.TWO_WAY_BINDING_REGEX, // bananasInABox (aka two way bindings)
      '^id$',                          // id
      '^class$',                       // class
      '^((?!(data-i19n)).)*$',         // other-attributes
      'data-i19n'                      // data-i19n
    ]
  },
  validSelfClosingTags: ['area', 'base', 'basefont', 'br', 'col', 'command', 'embed', 'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect', 'stop', 'use'],
  indentChars: '  ',
  newlineChars: CONSTANTS.CRLF,
  defaultDir: 'src/app',
  fileGlob: '*.component.html',
  debugFlag: false,
};

function init() {
  if (opt.debugFlag) {
    // DEBUG
    // const fileName = "src/app/dashboard/group/shared/stepper-steps/group-budget-pricing-step/group-budget-pricing-step.component.html";
    // const fileName = "src/app/dashboard/applications/applications-filter/applications-filter.component.html";
    // const fileName = 'src/app/dashboard/applications/applications-table/applications-table.component.html';
    // const fileName = 'src/app/dashboard/billing/billing-home/billing-home.component.html';
    // const fileName = 'src/app/dashboard/billing/shared/forms/credit-card-form/credit-card-form.component.html';
    // const fileName = 'src/app/dashboard/about/about.component.html';
    // const fileName = 'src/app/dashboard/group/shared/stepper-steps/group-name-step/group-name-step.component.html';
    const fileName = 'src/app/dashboard/group/group-detail/group-detail-edit-budget-dialog/group-detail-edit-budget-dialog.component.html';
    cleanFile(fileName);
    return;
  }

  const hasInputFileNames = (process.argv.length >= 3);
  const fileNameArray = hasInputFileNames ? process.argv.slice(2) : [opt.defaultDir];
  cleanFiles(fileNameArray);
}

function cleanFiles(fileNameArray) {
  fileNameArray.forEach((fileName) => {
    fs.lstat(fileName, (err, stats) => {
      if (err) throw err;
      if (stats.isDirectory()) {
        cleanDirectory(fileName);
        return;
      }
      if (!stats.isFile()) {
        throw new TidyException(`'${fileName}' is not a file`);
      }
      cleanFile(fileName);
    });
  });
}

function cleanDirectory(dirName) {
  const globPattern = `${dirName}/**/${opt.fileGlob}`;
  const options = {};
  glob(globPattern, options, (err, fileNameArray) => {
    if (err) throw err;
    cleanFiles(fileNameArray);
  });
}

function cleanFile(fileName) {
  fs.readFile(fileName, 'utf8', (err, html) => {
    if (err) throw err;
    cleanHtml(html, (newHtml) => {
      const isUpdated = (newHtml != null);
      if (!isUpdated) {
        return;
      }
      if (opt.debugFlag) {
        // DEBUG
        console.log('');
        console.log(newHtml);
      } else {
        const isHtmlChanged = (newHtml !== html);
        if (!isHtmlChanged) {
          return;
        }
        fs.writeFile(fileName, newHtml, (err) => {
          if (err) throw err;
          console.log('Updated', fileName);
        })
      }
    });
  });
}

function cleanHtml(inputHtml, callback) {
  const domHandler = new HtmlParser.DomHandler((err, allDomNodes) => {
    if (err) {
      console.log('err:', err);
      callback(null);
      return;
    }

    try {
      const resultHtml = getNodeArrayHtml(allDomNodes);
      callback(resultHtml);
    } catch (e) {
      if (!!e.message) {
        console.log('ERROR:', e.message);
      }
      callback(null);
    }
  });

  const parser = new HtmlParser.Parser(domHandler, {
    lowerCaseTags: false,
    lowerCaseAttributeNames: false
  });
  parser.write(inputHtml);
  parser.done();
}

function getNodeArrayHtml(nodes, indentLevel = 0) {
  let html = '';

  nodes.forEach(function (node) {
    if (node.type === 'root') {
      html += getNodeArrayHtml(node.children, indentLevel + 1);
      return;
    }

    if (node.type === 'text') {
      html += getNodeText(node, indentLevel);
      return;
    }

    if (node.type === 'comment') {
      html += getCommentHtml(node, indentLevel);
      return;
    }

    if (node.type === 'directive') {
      html += getDirectiveHtml(node, indentLevel);
      return;
    }

    html += getTagHtml(node, indentLevel);
  });

  return html;
}

function getTagHtml(node, indentLevel) {
  const tagIndent = getIndent(indentLevel);
  const tagName = node.name;
  let openTag = `${tagIndent}<${tagName}`;

  // Add html for tag attributes
  const tagAttributes = getTagAttributesHtml(node, indentLevel + 1);
  openTag += tagAttributes;

  // Determine if node has any children
  let hasChildren = (node.children.length > 0);
  if (hasChildren) {
    const hasASingleChild = (node.children.length === 1);
    if (hasASingleChild) {
      const childNode = node.children[0];
      const isChildTextNode = (childNode.type === 'text');
      if (isChildTextNode) {
        const isChildNodeEmpty = (childNode.data.trim() === "");
        if (isChildNodeEmpty) {
          hasChildren = false;
        }
      }
    }
  }

  // Return html if tag has no children
  let closeTag = `</${tagName}>`;
  if (!hasChildren) {
    const useSelfClosingTag = opt.validSelfClosingTags.includes(tagName);
    if (useSelfClosingTag) {
      return `${openTag}/>${opt.newlineChars}`;
    }
    const indentRegex = new RegExp(opt.newlineChars);
    const areAttributesIndented = indentRegex.test(tagAttributes);
    if (areAttributesIndented) {
      // Indent closing tag if attributes are indented
      return `${openTag}>${opt.newlineChars}${tagIndent}${closeTag}${opt.newlineChars}`;
    }
    return `${openTag}>${closeTag}${opt.newlineChars}`;
  }

  openTag += `>${opt.newlineChars}`;

  const childContent = getNodeArrayHtml(node.children, indentLevel + 1);

  closeTag = `${tagIndent}${closeTag}`;

  return `${openTag}${childContent}${closeTag}${opt.newlineChars}`;
}

function getTagAttributesHtml(node, indentLevel) {
  if (node.attribs == null) {
    return '';
  }

  let result = '';

  // Convert format
  const tagAttributeDataArray = [];
  const attributeNameArray = [];
  populateTagAttributeData(node.attribs, tagAttributeDataArray, attributeNameArray);

  // Sort attributes
  sortTagAttributeDataArray(tagAttributeDataArray);

  // Determine prefix for attributes
  const shouldIndent = Number.isInteger(opt.attribute.indentLengthThreshold) &&
    (attributeNameArray.length >= opt.attribute.indentLengthThreshold);
  const prefix = shouldIndent ? `${opt.newlineChars}${getIndent(indentLevel)}` : ' ';

  // Get tag attributes html
  for (const tagAttributeData of tagAttributeDataArray) {
    // Add attribute name
    result += prefix + tagAttributeData.name;
    // Add attribute value (possibly)
    const isAttributeValueEmpty = (tagAttributeData.value === "");
    const shouldAddAttributeValue = !isAttributeValueEmpty ||
      opt.attribute.emptyValueNames.indexOf(tagAttributeData.name) >= 0;
    if (shouldAddAttributeValue) {
      result += `="${tagAttributeData.value}"`;
    }
  }

  return result;
}

function getDirectiveHtml(node, indentLevel) {
  const indent = getIndent(indentLevel);
  const nodeHtml = getNodeOuterHtml(node);
  return `${indent}${nodeHtml}${opt.newlineChars}`;
}

function getNodeText(node, indentLevel) {
  let text = node.data;

  // Clean up newlines
  const newlineDetectRegexStr = `${CONSTANTS.CRLF}|${CONSTANTS.CR}(?!${CONSTANTS.LF})|${CONSTANTS.LF}`; // i.e. \r\n|\r(?!\n)|\n
  const newlineDetectRegex = new RegExp(newlineDetectRegexStr, 'g');
  text = text.replace(newlineDetectRegex, opt.newlineChars);

  // Get trimmed text
  let trimText = text.trim();
  const isEmpty = (trimText === "");
  if (!isEmpty) {
    const indent = getIndent(indentLevel);
    trimText = `${indent}${trimText}${opt.newlineChars}`;
  }

  // Add an extra newline for separation if desired
  const multipleNewlinesRegex = new RegExp(`${opt.newlineChars}\\s*${opt.newlineChars}\\s*$`);
  const endsWithMultipleNewlines = multipleNewlinesRegex.test(text);
  if (endsWithMultipleNewlines) {
    trimText += opt.newlineChars;
  }

  return trimText;
}

function getCommentHtml(node, indentLevel) {
  if (!node.data) {
    return '';
  }

  if (/^tidy-templates:\s*disable$/.test(node.data.trim())) {
    throw new TidyIgnoreFileException();
  }

  const indent = getIndent(indentLevel);
  const nodeHtml = getNodeOuterHtml(node);
  return `${indent}${nodeHtml}${opt.newlineChars}`;
}

function populateTagAttributeData(nodeAttributes, tagAttributeDataArray, attributeNameArray) {
  let attributeIndex = 0;
  for (let attributeName in nodeAttributes) {
    if (nodeAttributes.hasOwnProperty(attributeName)) {
      let attributeValue = nodeAttributes[attributeName];
      // Convert [property]="'value'" -> property="value"
      const oneWayBindingMatches = attributeName.match(CONSTANTS.ONE_WAY_BINDING_REGEX);
      const isOneWayBindingName = (oneWayBindingMatches && oneWayBindingMatches.length === 2);
      if (isOneWayBindingName) {
        const quotedStringValueMatches = attributeValue.match(CONSTANTS.QUOTED_STRING_REGEX);
        const isQuotedStringValue = (quotedStringValueMatches && quotedStringValueMatches.length === 2);
        if (isQuotedStringValue) {
          attributeName = oneWayBindingMatches[1];
          attributeValue = quotedStringValueMatches[1];
        }
      } else {
        // Convert property="{{ value }}" -> [property]="value"
        const expressionValueMatches = attributeValue.match(CONSTANTS.EXPRESSION_REGEX);
        const isExpressionValue = (expressionValueMatches && expressionValueMatches.length === 2);
        if (isExpressionValue) {
          attributeName = `[${attributeName}]`;
          attributeValue = expressionValueMatches[1].trim();
        }
      }
      const tagAttributeData = {
        name: attributeName,
        value: attributeValue,
        index: attributeIndex++
      };
      tagAttributeDataArray.push(tagAttributeData);
      attributeNameArray.push(attributeName);
    }
  }
}

function sortTagAttributeDataArray(tagAttributeDataArray) {
  tagAttributeDataArray.sort((a, b) => {
    const defaultResult = a.index - b.index;
    if (a.name === b.name) {
      return defaultResult;
    }

    // Sort by orderRegex
    const aIndex = getOrderRegexMatchIndex(a.name);
    const bIndex = getOrderRegexMatchIndex(b.name);
    if (opt.debugFlag) {
      // DEBUG
      console.log(`${a.name} = ${aIndex}, ${b.name} = ${bIndex}`);
    }
    if (aIndex < bIndex) {
      return -1;
    }
    if (aIndex > bIndex) {
      return 1;
    }

    // Use default sort if attributes are logic attributes
    const hasNgLogic = /^[*[(]/.test(a.name);
    if (opt.attribute.alphaSort == null || hasNgLogic) {
      return defaultResult;
    }
    // Sort alphabetically by name
    const result = opt.attribute.alphaSort ?
      a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    return result;
  });
}

function getOrderRegexMatchIndex(attributeName) {
  return opt.attribute.orderRegex.findIndex((item) => {
    const regex = (item instanceof RegExp) ? item : new RegExp(item);
    const isMatch = regex.test(attributeName);
    return isMatch;
  })
}

function getIndent(indentLevel) {
  return opt.indentChars.repeat(indentLevel);
}

function getTagPath(node) {
  let tagInfo = node.name;
  return (node.parent != null) ? `${getTagPath(node.parent)} > ${tagInfo}` : tagInfo;
}

function getNodeOuterHtml(node) {
  return DomUtils.getOuterHTML(node);
}

function TidyIgnoreFileException() {
  this.name = 'TidyIgnoreFileException';
}

function TidyException(message) {
  this.message = message;
  this.name = 'TidyException';
}

init();
