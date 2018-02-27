const dependable = require('dependable');
const path = require('path');

const container = dependable.container();

const simpleDependencies = [
    ['_', 'lodash']
];

//we register all our dependencies into the container here
simpleDependencies.forEach(function(val){
    container.register(val[0], function(){
        return require(val[1]);
    })
});

//this is a feature of dependable that helps avoid the use of export in our codes and requiring them in other files
container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));


//we now register this container
container.register('container', function(){
    return container;
});

//we now export it to the container file since that's where we would be using this
module.exports = container;
