process.on('message', function(m){
    console.log('message from parent: ' + JSON.stringify(m));
});
console.log('c: 1');
process.send({from: 'child'});
