var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var result = {};
    if (query['cmd'] == 'calcDistance')
    {
      result = calcDistance(query);
    }
    else if (query['cmd'] == 'calcCost')
    {
      result = calcCost(query);
    }   
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
 
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function calcDistance(query)
{
   if(isNaN(query['budget'])||!typeof(query['budget'] == 'number'))
      throw Error("Invalid value for budget");
   if(isNaN(query['mpg'])||!typeof(query['mpg'] == 'number'))
      throw Error("Invalid value for mpg"); 
   if(isNaN(query['fuelCost'])||!typeof(query['fuelCost'] == 'number')||parseInt(query['checks']) < 0)
      throw Error("Invalid value for fuelCost");      

  var distance = 0;
  distance = (query['budget'] / query['fuelCost']) * query['mpg'];
    
  var result = {'distance' : distance}; 
  return result;
}

function calcCost(query)
{
   if(isNaN(query['distance'])||!typeof(query['budget'] == 'number'))
      throw Error("Invalid value for budget");
   if(isNaN(query['mpg'])||!typeof(query['mpg'] == 'number'))
      throw Error("Invalid value for mpg"); 
   if(isNaN(query['fuelCost'])||!typeof(query['fuelCost'] == 'number')||parseInt(query['checks']) < 0)
      throw Error("Invalid value for fuelCost");      

  var tripCost = 0;
  tripCost = (query['distance'] / query['mpg']) * query['fuelCost'];
    
  var result = {'cost' : tripCost}; 
  return result;
}