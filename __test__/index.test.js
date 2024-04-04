/* *********#*********#*********#*********#*********#
*               SHORT CIRCUIT EVALUATION            * 
#*********#*********#*********#*********#********* */
// Long Hand
let dbHost;
if ( process.env.DB_HOST ) {
    dbHost = process.env.DB_HOST;
} else {
    dbHost = 'localhost';
}
// Short Hand
const dbHost = process.env.DB_HOST || 'localhost';

/* *********#*********#*********#*********#*********#
*                   MATH SHORTHANDS                 *
#*********#*********#*********#*********#********* */
// Long Hand
Math.floor( 4.9 ) === 4 //true
// Short Hand
~~4.9 === 4 //true
// Long Hand
Math.pow( 2,3 ); // 8
Math.pow( 2,2 ); // 4
// Short Hand
2**3 // 8
2**4 // 4

/* *********#*********#*********#*********#*********#
*                  FOR LOOP SHORTHAND               *
#*********#*********#*********#*********#********* */
// Long Hand
const fruits = [ 'mango', 'peach', 'banana' ];
for ( let i = 0; i < fruits.length; i++ ) {}
// Short Hand
for ( let fruit of fruits ) {}
// If you wanted to access index, do:
for ( let index in fruits ) {}

/* *********#*********#*********#*********#*********#
*               FIND FUNCTION SHORTHAND             *
#*********#*********#*********#*********#********* */
// Long Hand
const pets = [
    { type: 'Dog', name: 'Max' },
    { type: 'Cat', name: 'Karl' },
    { type: 'Dog', name: 'Tommy' },
];
function findDog( name ) {
    for ( let i = 0; i < pets.length; ++i ) {
        if ( pets[ i ].type === 'Dog' && pets[ i ].name === name ) {
            return pets[ i ];
        }
    }
}
// Short Hand
pet = pets.find( pet => pet.type === 'Dog' && pet.name === 'Tommy' );
console.log( pet ); // { type: 'Dog', name: 'Tommy' }

/* *********#*********#*********#*********#*********#
*              DESTRUCTURING ASSIGNMENT             *
#*********#*********#*********#*********#********* */
// Long Hand
const observable = require( 'mobx/observable' );
const action = require( 'mobx/action' );
const runInAction = require( 'mobx/runInAction' );

const store = this.props.store;
const form = this.props.form;
const loading = this.props.loading;
const errors = this.props.errors;
const entity = this.props.entity;
// Short Hand
import { observable, action, runInAction } from 'mobx';
const { store, form, loading, errors, entity } = this.props;
//You can even assign your own variable names:
const { store, form, loading, errors, entity:contact } = this.props;

/* *********#*********#*********#*********#*********#
*               JOINING & CLONING ARRAYS            *
#*********#*********#*********#*********#********* */
// Long Hand
// joining arrays
const odd = [ 1, 3, 5 ];
const nums = [ 2, 4, 6 ].concat( odd );
console.log( nums ); // [ 2, 4, 6, 1, 3, 5 ]
// cloning arrays
const arr = [ 1, 2, 3, 4 ];
const arr2 = arr.slice();
// Short Hand
// joining arrays
const odd = [ 1, 3, 5 ];
const nums = [ 2, 4, 6, ...odd ];
console.log( nums ); // [ 2, 4, 6, 1, 3, 5 ]
// cloning arrays
const arr = [ 1, 2, 3, 4 ];
const arr2 = [ ...arr ];

/* *********#*********#*********#*********#*********#
*                  TEMPLATE LITERALS                *
#*********#*********#*********#*********#********* */
// Long Hand
const welcome = 'You have logged in as ' + first + ' ' + last + '.';
const db = 'http://' + host + ':' + port + '/' + database;
// Short Hand
const welcome = `You have logged in as ${first} ${last}`;
const db = `http://${host}:${port}/${database}`;

/* *********#*********#*********#*********#*********#
*                STRING INTO A NUMBER               *
#*********#*********#*********#*********#********* */
// Long Hand
const num1 = parseInt( "100" );
const num2 = parseFloat( "100.01" );
// Short Hand
const num1 = +"100"; // converts to int data type
const num2 = +"100.01"; // converts to float data type