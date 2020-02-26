
const Handlebars = require("handlebars");
const fs = require('fs');

function getTemplateData(client, command, data){
	let filePath = process.cwd() + "\\lib\\views\\" + client + "\\" + command + ".hbs";

	console.log("FILEPATH is : "+filePath)
	let templateData = fs.readFileSync(filePath);
	const template = Handlebars.compile(templateData.toString(),  {noEscape: true});
	const compiledData = template(data);
	console.log(compiledData);
	return compiledData;
}

module.exports = {
	getTemplateData
}


// Handlebars.registerHelper("studyStatus", function(data, options) {
// 	var len = data.length;
// 	var returnData = "";
// 	for (var i = 0; i < len; i++) {
// 	  data[i].passingYear = (data[i].passingYear < 2015) ? "passed" : "not passed";
// 	  returnData = returnData + options.fn(data[i]);
// 	}
// 	return returnData;
//   })
  
//   //Retrieve the template data from the HTML .
//   var template = $('#handlebars-demo').html();
  
//   var context = {
// 	"students": [{
// 	  "name": "John",
// 	  "passingYear": 2013
// 	}, {
// 	  "name": "Doe",
// 	  "passingYear": 2016
// 	}]
//   }
  
//   //Compile the template data into a function
//   var templateScript = Handlebars.compile(template);
  
//   var html = templateScript(context);
//   //html = 'My name is Ritesh Kumar . I am a developer.'
  
//   $(document.body).append(html);

//   var hbs = exphbs.create({

// 	// Uses multiple partials dirs, templates in "shared/templates/" are shared
// 	// with the client-side of the app (see below).
// 	partialsDir: [
// 		'shared/templates/',
// 		'views/partials/'
// 	]
// });

// // Register `hbs` as our view engine using its bound `engine()` function.
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');

// function exposeTemplates(req, res, next) {
// 	// Uses the `ExpressHandlebars` instance to get the get the **precompiled**
// 	// templates which will be shared with the client-side of the app.
// 	hbs.getTemplates('shared/templates/', {
// 		cache      : app.enabled('view cache'),
// 		precompiled: true
// 	}).then(function (templates) {
// 		// RegExp to remove the ".handlebars" extension from the template names.
// 		var extRegex = new RegExp(hbs.extname + '$');

// 		// Creates an array of templates which are exposed via
// 		// `res.locals.templates`.
// 		templates = Object.keys(templates).map(function (name) {
// 			return {
// 				name    : name.replace(extRegex, ''),
// 				template: templates[name]
// 			};
// 		});

// 		// Exposes the templates during view rendering.
// 		if (templates.length) {
// 			res.locals.templates = templates;
// 		}

// 		setImmediate(next);
// 	})
// 	.catch(next);
// }
