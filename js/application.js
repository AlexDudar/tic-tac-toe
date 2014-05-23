'use strict';                             //using strict mode

var app = angular.module("TicTacToe", []);      //creating variable for our main module

app.factory('usersList', function () {        //creating factory
  var data = [                                //setting array with default elements
    {
      name: 'Super Mario',                    //setting name and score
      score: 1
    }
  ];

  return {
    list: function () {                       //creating method that will return elements from array
      return data;
    }
  };
});

app.controller("TicTacToeCtrl", ['$scope', 'usersList', function($scope, usersList) {   //creating main controller
  //injecting $scope and usersList(factory) into controller
  $scope.users = usersList.list();                  //creating users scope

  $scope.addUsers = function(){                    //method for adding players/users and pushing them to array
    $scope.users.push(
      {
        name: $scope.player1,
        score: 0
      },
      {
        name: $scope.player2,
        score: 0
      }
    );
  };

  $scope.initBoard = function () {                         //init for board
    $scope.boxes = ['','','','','','','','',''];            //empty boxes for ng-repeat

    for(var i = 0; i < $scope.boxes.length; i++) {          //clearing boxes
      $scope.boxes[i] = '';
    }

    //  $scope.currentPlayer == $scope.player2;             //setting currentplayer

    $scope.message = '';                                //empty victory or draw message

    $scope.moves = 1;                                 //setting moves

    $scope.gameover = false;

    $scope.board = [                                  //creating empty board
      [ '' , '' , '' ],
      [ '' , '' , '' ],
      [ '' , '' , '' ]
    ];

  };


  $scope.setSymbol = function(index) {                  //setting symbols(x or o) in according to boxes index
    if ($scope.gameover == false && $scope.boxes[index] == '') {                   //checking if game is not over, if false we can play
      if ($scope.currentPlayer == $scope.player1) {     //if current player posted his symbol setting next move to next player
        $scope.boxes[index] = 'o';
        $scope.currentPlayer = $scope.player2;
      } else {
        $scope.boxes[index] = 'x';
        $scope.currentPlayer = $scope.player1;
      }
    }
    $scope.row = Math.floor(index/3);                    //splitting board on rows and columns
    $scope.column = (index % 3);
    $scope.board[$scope.row][$scope.column] = $scope.currentPlayer;
    if ($scope.gameover == false) {
      evaluateWinner();                             //looking our rules to find a winner
    }
  };

  var evaluateWinner = function() {                //winning rules

    function check_rows() {                       //checking is any of the rows has 3 similar symbols
      for (var i = 0; i < $scope.board.length; i++) {         //board iterating
        var similar = true;                                   //default value
        for (var j = 0; j < $scope.board[i].length; j++) {      //checking each row
          if ($scope.board[i][j] === '' || $scope.board[i][j] !== $scope.board[i][0]) {
            similar = false;
          }
        }
        if (similar) {                      //returning similar if true
          return similar;
        }
      }
    }

    function check_columns() {                   //checking is any of the columns has 3 similar symbols
      for (var i = 0; i < $scope.board.length; i++) {
        var similar = true;
        for (var j = 0; j < $scope.board[i].length; j++) {        //checking each column
          if ($scope.board[j][i] === '' || $scope.board[j][i] !== $scope.board[0][i]) {
            similar = false;
          }
        }
        if (similar) {
          return similar;
        }
      }
    }

    function check_diagonals() {            //checking if any of the diagonals has 3
      var similar = true;
      for (var i = 0; i < $scope.board.length; i++) {
        if ($scope.board[i][i] === '' || $scope.board[i][i] !== $scope.board[0][0]) {
          similar = false;
        }
      }
      if (similar) {
        return similar;
      }
      similar = true;
      for (var i = 0; i < $scope.board.length; i++) {         //checking diagonals
        if ($scope.board[i][2 - i] === '' || $scope.board[i][2 - i] !== $scope.board[0][2]) {
          similar = false;
        }
      }
      if (similar) {
        return similar;
      }
    }

    if ($scope.moves == 9) {                          //if users made 9 moves game over, it's draw
      $scope.message = "Nobody won, it's draw";
    } else {
      $scope.moves += 1;                        //if not go to next player move
    }

    if (check_rows() === true || check_columns() === true || check_diagonals() === true){   //checking rules
      $scope.winner();                                        // if one of them true running winner function
    }
  };


  $scope.winner = function(){
    $scope.message = $scope.currentPlayer + ' won this game!';      //winning message
    $scope.gameover = true;                                     //game over flag

    var thisUser = $scope.currentPlayer;

    $scope.editUser = function(thisUser) {         //search user with given name and update it
      for(var i in $scope.users) {
        if($scope.users[i].name == thisUser) {
          $scope.newUser = angular.copy($scope.users[i]);   //use angular.copy() method to create copy of original object
          $scope.newUser.score += 1;                    //adding score
          $scope.users[i] = $scope.newUser;             //setting user
        }
      }
    };

    $scope.editUser($scope.currentPlayer);

  };


}]);
