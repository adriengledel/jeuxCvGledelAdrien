$(document).ready(function () {
  
  var idIntervalShuriken;
  var idIntervalCourir;
  var idIntervalNinjaMeurt;
  var idCourMaitreSam;
  var idCourEnnemi;
  var idRequestPlay;
  var ninjaVivant = true;
  var ennemi = [];
  var ennemiMort = false;
  var lancerEnnemiGauche;
  var lancerEnnemiDroit;
  var shuriken = [];
  var creationImgShuriken;
  var nbShuriken = 0;
  var nbCoup = 0;
  var animationNinja = false;
  var checkCollision = 3;
  var checkCollisionEnnemi;
  var checkCollisionNinja = 3;
  var indiceIdMasqueEnnemi = 1;
  var indiceIdShuriken = 1;
  var finDeJeu = false;
  var jouer;
  var temps = 70;
  var ninjaCourSansLancerDeShuriken;
  var lancerShurikenSansCourir = false;
  
  var sonShuriken = new Audio('sounds/shuriken.mp3');
  
  var personnage = document.getElementById("ninjasprite");
  var masque = document.getElementById("masqueNinja");
  personnage.style.left = "0px";
  masque.style.transform = "scaleX(1)";


  // creation de mon objet ninja
  var ninja = {

    direction: function () {
      ninjaCourSansLancerDeShuriken = true; // le ninja ne peut lancer lancer un shuriken et marcher en meme temps
      if (animationNinja === false) {
        idIntervalCourir = setInterval(function () {
          if (ninjaCourSansLancerDeShuriken && lancerShurikenSansCourir === false) {
            animationNinja = true; // animationNinja permet de lancer le parallax
            if (parseFloat(personnage.style.left) === -1008) {
              personnage.style.left = '-72px'; // cette condition permet de boucler le sprite du ninja
            }
            var avance = parseFloat(personnage.style.left) - 72 + "px";
            personnage.style.left = avance;
          }
        }, 40);
      }
    },

    positionInitiale: function () {
      personnage.style.left = "0px";
      masque.style.width = "58px";
      masque.style.left = "403px";
    },
    positionCoup: function () {

      if (nbCoup === 0) {

        clearInterval(idIntervalCourir);
        personnage.style.left = "-1072px";
        masque.style.width = "86px";
        nbCoup = 1; //le ninja ne peut faire la figure pour lancer des shuriken qu'a partir de la mort de l'ennemi ou du shuriken en dehors du cadre.
      }



    },

    meurt: function (position) {
      // l'argument position est utile dans le cas ou le ninja meurt dans la position scaleX(1) ou scaleX(-1)
      var identifiantDInterpolation = 0;
      var ninjaMeurt = 0;
      idIntervalNinjaMeurt = setInterval(function () {
        if (ninjaMeurt < 8) {
          ninjaMeurt += 1;
          var interpolationNinja = {
            ninjaMeurt: [{
                image: {
                  left: "-1188px"
                },
                masque: {
                  width: "156px",
                  left: position
                }
              }, {
                image: {
                  left: "-1341px"
                },
                masque: {
                  width: "156px",
                  left: position
                }
              }, {
                image: {
                  left: "-1524px"
                },
                masque: {
                  width: "156px",
                  left: position
                }
              }, {
                image: {
                  left: "-1716px"
                },
                masque: {
                  width: "156px",
                  left: position
                }
              }, {
                image: {
                  left: "-1909px"
                },
                masque: {
                  width: "156px",
                  left: position
                }
              },
              {
                image: {
                  left: "-2111px"
                },
                masque: {
                  width: "156px",
                  left: position
                }
              }
            ]
          }

          var x = interpolationNinja.ninjaMeurt[identifiantDInterpolation].image.left;
          var y = interpolationNinja.ninjaMeurt[identifiantDInterpolation].masque.width;
          var r = interpolationNinja.ninjaMeurt[identifiantDInterpolation].masque.left;

          $('#ninjasprite').css('left', x);
          $('#masqueNinja').css('width', y);
          $('#masqueNinja').css('left', r);

          identifiantDInterpolation++;
          // cette condition boucle l'animation de sang lorsque le ninja meurt
          if (($('#ninjasprite').css('left')) === '-2111px') {
            identifiantDInterpolation = 4;
            ninjaMeurt = 4;
          }
        }
      }, 80);
    }

  }


  var Shuriken = function () {
    var x = 0;
  var y = 0;
    this.lancer = function () {
      //lancer de shuriken a droite
      
      if (masque.style.transform === "scaleX(1)") { // si le ninja va dans la direction de droite
        if (nbShuriken === 0) { // si le shuriken peut etre à nouveau lancer
          sonShuriken.play(); 
          $('#compteur-shuriken img:last-child').remove(); // suppression en haut a gauche du jeu de l'image du dernier shuriken
          shuriken.shift(); // suppression d'un shuriken du tableau
          checkCollision = 2;// permet de lancer la recherche de collision
          //création de l'image du shuriken
          creationImgShuriken = document.createElement("img");
          creationImgShuriken.src = "image/shuriken.png";
          creationImgShuriken.style.position = "absolute";
          creationImgShuriken.style.left = "475px";
          creationImgShuriken.style.top = "420px";
          creationImgShuriken.style.width = "22px";
          creationImgShuriken.id = "shuri" + indiceIdShuriken;
          document.getElementById("shuriken").appendChild(creationImgShuriken);
          idIntervalShuriken = setInterval(function () {
            x = x + 20;
            y = y + 12;
            creationImgShuriken.style.transform = "rotate(" + x + "deg)";
            creationImgShuriken.style.left = parseFloat(creationImgShuriken.style.left) + y + "px";
            y = y - 12;
            if (parseFloat(creationImgShuriken.style.left) > 1000) {
              clearInterval(idIntervalShuriken);
              nbShuriken = 0; //si le shuriken depasse 1000px nbShuriken est réinitialisé afin de pouvoir générer un shuriken
              nbCoup = 0; //nbCoup est réinitialisé afin de pouvoir générer le mouvement
              $("#shuri" + indiceIdShuriken).remove(); // suppression de l'image shuriken
              indiceIdShuriken - 1; // si pas de collision avec un ennemi décrementation de l'Id de l'image afin de que le recherche de collision fonctionne


            }

          }, 20);
          nbShuriken = 1; //le ninja ne peut envoyer des shuriken qu'a partir de la condition ci-dessus ou de la collision avec l'ennemi
        }
      }
      //lancer de shuriken a gauche
      if (masque.style.transform === "scaleX(-1)") {  // si le ninja va dans la direction de gauche
        if (nbShuriken === 0) { // si le shuriken peut etre à nouveau lancer
          sonShuriken.play(); 
          $('#compteur-shuriken img:last-child').remove();// suppression en haut a gauche du jeu de l'image du dernier shuriken
          shuriken.shift();// suppression d'un shuriken du tableau
          checkCollision = 2;// permet de lancer la recherche de collision
          //création de l'image du shuriken
          creationImgShuriken = document.createElement("img");
          creationImgShuriken.src = "image/shuriken.png";
          creationImgShuriken.style.position = "absolute";
          creationImgShuriken.style.left = "380px";
          creationImgShuriken.style.top = "420px";
          creationImgShuriken.style.width = "22px";
          creationImgShuriken.id = "shuri" + indiceIdShuriken;
          document.getElementById("shuriken").appendChild(creationImgShuriken);
          idIntervalShuriken = setInterval(function () {
            x = x - 20;
            y = y - 12;
            creationImgShuriken.style.transform = "rotate(" + x + "deg)";
            creationImgShuriken.style.left = parseFloat(creationImgShuriken.style.left) + y + "px";
            y = y + 12;
            if (parseFloat(creationImgShuriken.style.left) < -50) {
              clearInterval(idIntervalShuriken);
              nbShuriken = 0; //si le shuriken depasse 1000px nbShuriken est réinitialisé afin de pouvoir générer un shuriken
              nbCoup = 0; //nbCoup est réinitialisé afin de pouvoir générer le mouvement
              $("#shuri" + indiceIdShuriken).remove();// suppression de l'image shuriken
              indiceIdShuriken - 1;// si pas de collision avec un ennemi décrementation de l'Id de l'image afin de que le recherche de collision fonctionne
            }

          }, 20);
          nbShuriken = 1; //le ninja ne peut envoyer des shuriken qu'a partir de la condition ci-dessus ou de la collision avec l'ennemi
        }
      }
    }

  } // fin du constructor Shuriken

  var maitreSam = function () {

    idCourMaitreSam = setInterval(function () {
      if (ennemi.length === 0 && ninjaCourSansLancerDeShuriken) {
        finDeJeu = true;// on a plus accès au touche clavier
        ninja.positionInitiale();
        clearInterval(idIntervalCourir);// la course du ninja est stoppé
        if (parseFloat($("#sprite-sam").css('left')) === -89) { //alternance de 2 images
          $("#sprite-sam").css({
            left: '-183px'
          });
        } else {
          $("#sprite-sam").css({
            left: '-89px'
          });
        }
        var a = parseFloat($("#masque-sam").css('left')) - 1 + "px"; // deplacement du masque
        $("#masque-sam").css({
          left: a
        });

        if (parseFloat($("#masque-sam").css('left')) === 491) {
          clearInterval(idCourMaitreSam);

          $("#sprite-sam").css({
            left: '-3px'
          });
          $('#parchemin-final').css({
            display: 'block'
          });
          $('#bulle-final').fadeIn();
        }
      }
    }, 10);
  }();


  var EnnemiNinja = function () {
    this.image = function (position, scale) {
      ennemiMort = false;
      var creationMasqueEnnemi = document.createElement("div");
      creationMasqueEnnemi.style.position = "absolute";
      creationMasqueEnnemi.style.top = "308px";
      creationMasqueEnnemi.style.overflow = "hidden";
      creationMasqueEnnemi.id = "masqueEnnemi" + indiceIdMasqueEnnemi;
      creationMasqueEnnemi.style.left = position;
      creationMasqueEnnemi.style.transform = scale;
      creationMasqueEnnemi.style.width = "124px";
      creationMasqueEnnemi.style.height = "252px";
      document.getElementById("contain").appendChild(creationMasqueEnnemi);
      var creationSpriteEnnemi = document.createElement("img");
      creationSpriteEnnemi.src = "image/spriteEnnemiFinal.png";
      creationSpriteEnnemi.id = "spriteEnnemi" + indiceIdMasqueEnnemi;
      creationSpriteEnnemi.style.position = "absolute";
      creationSpriteEnnemi.style.left = "0px";
      creationSpriteEnnemi.style.width = "1930px";
      document.getElementById("masqueEnnemi" + indiceIdMasqueEnnemi).appendChild(creationSpriteEnnemi);

    }

    this.cours = function (avance) {
      var identifiantDInterpolation = 0;
      var animationCourir = 0;
      idCourEnnemi = setInterval(function () {
        if (animationCourir <= 4) {
          animationCourir += 1;
          var interpolationEnnemi = {
            ennemiCour: [{
              image: {
                left: "0px"
              },
              masque: {
                width: "118px"
              }
            }, {
              image: {
                left: "-121px"
              },
              masque: {
                width: "118px"
              }
            }, {
              image: {
                left: "-240px"
              },
              masque: {
                width: "118px"
              }
            }, {
              image: {
                left: "-360px"
              },
              masque: {
                width: "118px",
              }
            }, {
              image: {
                left: "-476px"
              },
              masque: {
                width: "118px",
              }
            }]
          }
          var x = interpolationEnnemi.ennemiCour[identifiantDInterpolation].image.left;
          var y = interpolationEnnemi.ennemiCour[identifiantDInterpolation].masque.width;
          $('#spriteEnnemi' + indiceIdMasqueEnnemi).css('left', x);
          $('#masqueEnnemi' + indiceIdMasqueEnnemi).css('width', y);
          var a = parseFloat(document.getElementById("masqueEnnemi" + indiceIdMasqueEnnemi).style.left) + avance + "px";
          document.getElementById("masqueEnnemi" + indiceIdMasqueEnnemi).style.left = a;
          if (identifiantDInterpolation === 4) {
            identifiantDInterpolation = -1;
            animationCourir = 0;
          }
          identifiantDInterpolation++;
        }
      }, temps);
    };

    this.mourir = function () {
      ennemiMort = true;
      var identifiantDInterpolationDuCoupDePoing = 0;
      var animationMourir = 0;
      setInterval(function () {
        if (animationMourir < 4) {
          animationMourir += 1;
          var interpolationEnnemi = {
            ennemiMeurt: [{
              image: {
                left: "-597px"
              },
              masque: {
                width: "115px"
              }
            }, {
              image: {
                left: "-800px"
              },
              masque: {
                width: "115px"
              }
            }, {
              image: {
                left: "-940px"
              },
              masque: {
                width: "141px"
              }
            }, {
              image: {
                left: "-1092px"
              },
              masque: {
                width: "164px",
                top: "325px"
              }
            }]
          }
          var x = interpolationEnnemi.ennemiMeurt[identifiantDInterpolationDuCoupDePoing].image.left;
          var y = interpolationEnnemi.ennemiMeurt[identifiantDInterpolationDuCoupDePoing].masque.width;
          var r = interpolationEnnemi.ennemiMeurt[identifiantDInterpolationDuCoupDePoing].masque.top;
          $('#spriteEnnemi' + indiceIdMasqueEnnemi).css('left', x);
          $('#masqueEnnemi' + indiceIdMasqueEnnemi).css('width', y);
          $('#masqueEnnemi' + indiceIdMasqueEnnemi).css('top', r);

          identifiantDInterpolationDuCoupDePoing++;
        }
      }, 110);
    };
    this.coupDeKatana = function (position1, Position2, position3) {
      var identifiantDInterpolation = 0;
      var animationCoupDeKatana = 0;
      setInterval(function () {
        if (animationCoupDeKatana < 5) {
          animationCoupDeKatana += 1;
          var interpolationEnnemi = {
            ennemiCoupDeKatana: [{
              image: {
                left: "-1474px"
              },
              masque: {
                width: "75px"
              }
            }, {
              image: {
                left: "-1555px"
              },
              masque: {
                width: "75px"
              }
            }, {
              image: {
                left: "-1635px"
              },
              masque: {
                width: "114px",
                left: position1
              }
            }, {
              image: {
                left: "-1773px"
              },
              masque: {
                width: "158px",
                left: Position2
              }
            }, {
              image: {
                left: "-1474px"
              },
              masque: {
                width: "75px",
                left: position3
              }
            }]
          }
          var x = interpolationEnnemi.ennemiCoupDeKatana[identifiantDInterpolation].image.left;
          var y = interpolationEnnemi.ennemiCoupDeKatana[identifiantDInterpolation].masque.width;
          var r = interpolationEnnemi.ennemiCoupDeKatana[identifiantDInterpolation].masque.left;
          $('#spriteEnnemi' + indiceIdMasqueEnnemi).css('left', x);
          $('#masqueEnnemi' + indiceIdMasqueEnnemi).css('width', y);
          $('#masqueEnnemi' + indiceIdMasqueEnnemi).css('left', r);

          identifiantDInterpolation++;
        }
      }, 80);
    };
  } // fin du constructeur EnnemiNinja


  var parcheminCv = function () {
    // acces cv parchemin en haut a droite
    $('#masque-parchemin').mouseenter(function () {

      var identifiantDInterpolation = 0;
      var animationParchemin = 0;
      setInterval(function () {
        if (animationParchemin < 4) {
          animationParchemin += 1;
          var interpolationParchemin = {
            parchemin: [{
              image: {
                left: "-625px"
              },
              masque: {
                height: "77px"

              }
            }, {
              image: {
                left: "-423px"
              },
              masque: {
                height: "106px"

              }
            }, {
              image: {
                left: "-210px"
              },
              masque: {
                height: "153px"


              }
            }, {
              image: {
                left: "-4px"

              },
              masque: {
                height: "184px"

              }
            }]
          }


          var x = interpolationParchemin.parchemin[identifiantDInterpolation].image.left;
          var y = interpolationParchemin.parchemin[identifiantDInterpolation].masque.height;

          $('#sprite-parchemin').css('left', x);
          $('#masque-parchemin').css('height', y);

          identifiantDInterpolation++;
        }
      }, 40);

    });
    $('#masque-parchemin').mouseleave(function () {

      var identifiantDInterpolation = 0;
      var animationParchemin = 0;
      setInterval(function () {
        if (animationParchemin < 5) {
          animationParchemin += 1;
          var interpolationParchemin = {
            parchemin: [{
              image: {
                left: "-4px"

              },
              masque: {
                height: "184px"

              }
            }, {
              image: {
                left: "-210px"
              },
              masque: {
                height: "153px"


              }
            }, {
              image: {
                left: "-423px"
              },
              masque: {
                height: "106px"

              }
            }, {
              image: {
                left: "-625px"
              },
              masque: {
                height: "77px"

              }
            }, {
              image: {
                left: "-818px"
              },
              masque: {
                height: "48px"

              }
            }]
          }


          var x = interpolationParchemin.parchemin[identifiantDInterpolation].image.left;
          var y = interpolationParchemin.parchemin[identifiantDInterpolation].masque.height;

          $('#sprite-parchemin').css('left', x);
          $('#masque-parchemin').css('height', y);

          identifiantDInterpolation++;
        }
      }, 40);

    });
  }();


  var creationDecor = function () {
    $('#arriereplan').css({
      left: '0px'
    });
    $('#arriereplanparallax').css({
      left: '980px'
    });
    $('#decor3eplan').css({
      left: '200px',
      top: '128px'
    });
    $('#plan2').css({
      left: '0px'
    });
    $('#plan2parallax').css({
      left: '1000px',
      top: '246px'
    });
    $('#plan1').css({
      left: '0px',
      top: '451px'
    });
    $('#plan1parallax').css({
      left: '996px',
      top: '451px'
    });

  }

  var parallax = function () {
    setInterval(function () {
      //effet parallax du decor avec 4 plan defilant a une allure differente
      if (masque.style.transform === "scaleX(1)" && animationNinja && ninjaCourSansLancerDeShuriken && personnage.style.left != "0px") {
        var arriereplanparallax = parseFloat($('#arriereplanparallax').css('left')) - 0.01 + "px";
        var arriereplan = parseFloat($('#arriereplan').css('left')) - 0.01 + "px";
        $("#arriereplanparallax").css({
          left: arriereplanparallax
        });
        $("#arriereplan").css({
          left: arriereplan
        });
        if (parseFloat($('#arriereplanparallax').css('left')) === 0) {
          $("#arriereplanparallax").css({
            left: '980px'
          });
        }

        var decor3eplan = parseFloat($('#decor3eplan').css('left')) - 0.08 + "px";
        $("#decor3eplan").css({
          left: decor3eplan
        });



        var plan2parallax = parseFloat($('#plan2parallax').css('left')) - 0.4 + "px";
        var plan2 = parseFloat($('#plan2').css('left')) - 0.4 + "px";
        $("#plan2parallax").css({
          left: plan2parallax
        });
        $("#plan2").css({
          left: plan2
        });
        if (parseFloat($('#plan2parallax').css('left')) === 0) {
          $("#plan2parallax").css({
            left: '1000px',
            top: '246px'
          });
        }

        var plan1parallax = parseFloat($('#plan1parallax').css('left')) - 2 + "px";
        var plan1 = parseFloat($('#plan1').css('left')) - 2 + "px";
        $("#plan1parallax").css({
          left: plan1parallax
        });
        $("#plan1").css({
          left: plan1
        });
        if (parseFloat($('#plan1parallax').css('left')) < -998) {
          $("#plan1parallax").css({
            left: '992px',
            top: '451px'
          });
        }
        if (parseFloat($('#plan1').css('left')) < -998) {
          $("#plan1").css({
            left: '992px',
            top: '451px'
          });
        }
        if (parseFloat($('#plan1').css('left')) === 0 || parseFloat($('#plan1').css('left')) === 500) {
          lancerEnnemiDroit = true;//apparition des ennemis de la droite (je fais apparaitre les ennemis par rapport à la distance parcouru du personnage)
        }
        if (parseFloat($('#plan1parallax').css('left')) === 0 || parseFloat($('#plan1parallax').css('left')) === 500) {
          lancerEnnemiGauche = true;// apparition des ennemis de la gauche
        }


      }

    }, 15);

  }();




  
  var CreationTableauEnnemiEtShuriken = function () {
    for (var u = 0; u < 8; u++) {
      ennemi.push(new EnnemiNinja);
    }

    var positionShuriken = 120;
    for (var u = 0; u < 9; u++) {
      $('#compteur-shuriken').append('<img src="image/shuriken.png" alt="">');
      document.getElementById('compteur-shuriken').children[u].style.left = positionShuriken + "px"; //creation des shuriken du compteur en haut a gauche
      shuriken.push(new Shuriken);
      positionShuriken = positionShuriken + 20;
    }
  };



  var creationEnnemi = function () {
    if (lancerEnnemiGauche) {
      lancerEnnemiGauche = false;
      ennemi[0].image("-100px", "scaleX(1)");
      ennemi[0].cours(20);
    }
    if (lancerEnnemiDroit) {
      lancerEnnemiDroit = false;
      ennemi[0].image("1000px", "scaleX(-1)");
      ennemi[0].cours(-10);
    }
  };




  var collision = function() {

    // collision Ennemi avec shuriken                
    if (checkCollision === 2) {// 2 est initialisé au moment du lancé de shuriken 
      if (parseFloat($("#masqueEnnemi" + indiceIdMasqueEnnemi).css('left')) < parseFloat($("#shuri" + indiceIdShuriken).css('left')) + parseFloat($("#shuri" + indiceIdShuriken).css('width')) && parseFloat($("#masqueEnnemi" + indiceIdMasqueEnnemi).css('left')) + parseFloat($("#masqueEnnemi" + indiceIdMasqueEnnemi).css('width')) - 30 > parseFloat($("#shuri" + indiceIdShuriken).css('left'))) {

        console.log('COLISION !!!');
        checkCollision = 1;// permet de lancer l'évenement lié à la collision 
        checkCollisionEnnemi = true;

      }
    }

    //collision avec Ennemi venant de la droite
    if ($('#masqueEnnemi' + indiceIdMasqueEnnemi).css('transform') === "matrix(-1, 0, 0, 1, 0, 0)") {//non détecté sur les anciens navigateurs 
      if (checkCollisionNinja === 3) { //au lancement de la partie la checkcollisionNinja est initialisé a 3 donc la recherche de collision est lancé

        if (parseFloat($("#masqueEnnemi" + indiceIdMasqueEnnemi).css('left')) < parseFloat($("#masqueNinja").css('left')) + (parseFloat($("#masqueNinja").css('width')) + 50) && (parseFloat($("#masqueEnnemi" + indiceIdMasqueEnnemi).css('left')) + 100) + parseFloat($("#masqueEnnemi" + indiceIdMasqueEnnemi).css('width')) - 30 > parseFloat($("#masqueNinja").css('left')) && !ennemiMort) {
          console.log('COLISSION !!!');
          checkCollisionNinja = 1;// permet de lancer les evenements liés à cette collision
          ninjaVivant = false;



        }
      }
    }
    // collision avec Ennemi venant de la gauche
    if ($('#masqueEnnemi' + indiceIdMasqueEnnemi).css('transform') === "matrix(1, 0, 0, 1, 0, 0)") {//non détecté sur les anciens navigateurs 
      if (checkCollisionNinja === 3) {//au lancement de la partie la checkcollisionNinja est initialisé a 3 donc la recherche de collision est lancé


        if (parseFloat($("#masqueEnnemi" + indiceIdMasqueEnnemi).css('left')) < parseFloat($("#masqueNinja").css('left')) + (parseFloat($("#masqueNinja").css('width'))) && (parseFloat($("#masqueEnnemi" + indiceIdMasqueEnnemi).css('left')) + 100) + parseFloat($("#masqueEnnemi" + indiceIdMasqueEnnemi).css('width')) - 30 > parseFloat($("#masqueNinja").css('left')) && !ennemiMort) {
          console.log('COLISSION !!!');
          checkCollisionNinja = 1;// permet de lancer les evenements liés à cette collision
          ninjaVivant = false;



        }
      }
    }

  };



  var evenementCollision = function () {
    // collision de l'ennemi avec le shuriken
    setInterval(function () {
      if (checkCollision === 1) {
        checkCollision = 3;// permet d'arretet la recherche de collision
        clearInterval(idIntervalShuriken);// arret du shuriken
        document.getElementById("shuri" + indiceIdShuriken).style.display = "none";//suppression de l'image du shuriken
        clearInterval(idCourEnnemi);//arret de la course de l'ennemi
        ennemi[0].mourir();// lancement du sprite de la mort de l'ennemi
        temps = 50;// augmentation de la vitesse des ennemis 2 et plus
        indiceIdShuriken++; //  incrementation de l'Id du shuriken

        if (checkCollisionEnnemi) {

          ennemi.shift();// suppression d'un ennemi du tableau qui permet la mise a jour du nombre d'ennemi vivant
          setTimeout(function () {
            $("#masqueEnnemi" + indiceIdMasqueEnnemi).fadeOut();
            indiceIdMasqueEnnemi++;//incrementation de l'Id de l'ennemi
            nbShuriken = 0; //ennemi mort donc on peut a nouveau lancer un shuriken
            nbCoup = 0; //ennemi mort donc on peut a nouveau faire le mouvement du lancer de shuriken
          }, 2000);
        }
      }



      if (checkCollisionEnnemi) {
        if (animationNinja && !finDeJeu) { // si le ninja avance le corps mort de l'ennemi se deplace avec cohérance en étant coordonné avec le plan1 du parallax
          var masqueEnnemiFixe = parseFloat($('#masqueEnnemi' + indiceIdMasqueEnnemi).css('left')) - 2 + "px";
          $("#masqueEnnemi" + indiceIdMasqueEnnemi).css({
            left: masqueEnnemiFixe
          });

        }
      }

      // collision de l'ennemi avec le ninja

      if (checkCollisionNinja === 1) {

        checkCollisionNinja = 2;//permet d'arreter l'evenement de la collision
        clearInterval(idCourEnnemi);// stop de la course de l'ennemi
        clearInterval(idIntervalCourir);// stop de la course du ninja
        animationNinja = false; 
        if ($('#masqueEnnemi' + indiceIdMasqueEnnemi).css('transform') === "matrix(-1, 0, 0, 1, 0, 0)") {

          ennemi[0].coupDeKatana("460px", "431px", "501px");
        }
        if ($('#masqueEnnemi' + indiceIdMasqueEnnemi).css('transform') === "matrix(1, 0, 0, 1, 0, 0)") {

          ennemi[0].coupDeKatana("281px", "281px", "281px");
        }
        setTimeout(function () {
          if (masque.style.transform === "scaleX(1)") { // si meurt en etant dirigé vers la droite
            ninja.meurt();
          }
          if (masque.style.transform === "scaleX(-1)") { // si ninja meurt dirigé vers la gauche
            ninja.meurt("322px");
          }
        }, 400);

        setTimeout(function () {
          $('#gameover').fadeIn(2000);
          $('#reload').fadeIn(2000);

        }, 3000);


      }

      if (ennemi.length === 0) {
        clearInterval(idIntervalCourir); // si le nombre d'ennemi atteint 0 la course du ninja est arreté
      }

    }, 15);

  }();


  var explcationJeu = function () {
    setTimeout(function () {
      $('#bouton-explicatif').fadeOut(3000);
    }, 2000);
    $('#phrase').css({
      display: 'none'
    });
    setTimeout(function () {
      $('#phrase').fadeIn(2000);
    }, 5000);
    setTimeout(function () {
      $('#phrase-samourai').fadeOut(2000);
    }, 9000);
  }

  var LancementJeu = function () {
    explcationJeu();
    $('#play').css({
      width: '800px',
      cursor: 'pointer',
      marginLeft: '76px',
      display: 'block'
    });
    $("#play").click(function(){
      finDeJeu = false;
      ninjaVivant = true;
      $('#play').css({
        display: 'none'
      });
      var audioGong = document.getElementById('sonGong');
      audioGong.play();
      jouer = true;//permet de rentrer dans la condition de la fonction init()
      init();

    });

  }();


  $('#reload').click(function () {
    //fonction relance la partie sans passé par les explications de jeu ni par le bouton play
    clearInterval(idIntervalNinjaMeurt);// stop de l'animation ninja meurt
    $('#gameover').css({
      display: 'none'
    });
    $('#reload').css({
      display: 'none'
    });
    checkCollisionNinja = 3;// reinitialisation de la collision
    $('#masqueEnnemi' + indiceIdMasqueEnnemi).remove();// suppression de l'ennemi qui a tué le ninja
    $('#compteur-shuriken img').remove();//suppression des images compteur de shuriken 
    ennemi.splice(0, 8);//suppression du tableau ennemi afin d'etre réinitialiser avec le bon nombre d'index
    shuriken.splice(0, 9);//idem
    finDeJeu = false;
    ninjaVivant = true;//permet de rentrer dans la condition des touches clavier
    jouer = true;
    init();
  });

 
  var init = function () {
    ninjaCourSansLancerDeShuriken = false;
    lancerShurikenSansCourir = false;
    ninja.positionInitiale();
    masque.style.transform = "scaleX(1)";
    CreationTableauEnnemiEtShuriken();
    creationDecor();
    idRequestPlay = setInterval(function () {
      if (jouer) {
        collision();
        creationEnnemi();
        window.addEventListener("keydown", clavierKeyDown,false);
        window.addEventListener("keyup", clavierKeyUp,false);
        $('#compteur-ennemi').html(ennemi.length);
      }
      
    },10);
    

  };







  function clavierKeyDown(event) {
    var code = event.keyCode;
    if (ninjaVivant && finDeJeu === false) {
      switch (code) {

        case 37://fleche gauche
          masque.style.transform = "scaleX(-1)";
          $('#masqueNinja').css({'-ms-transform':'scaleX(-1)'});//internet explorer 9
          $('#masqueNinja').css({'-moz-transform':'scaleX(-1)'});//mozilla 5
          ninja.positionInitiale();
          break;

        case 39://fleche droite
          masque.style.transform = "scaleX(1)";
          $('#masqueNinja').css({'-ms-transform':'scaleX(1)'});//internet explorer 9
          $('#masqueNinja').css({'-moz-transform':'scaleX(1)'});//mozilla 5

          ninja.direction();
          animationNinja = true;
          break;

        case 32://espace
          animationNinja = false;
          lancerShurikenSansCourir = true;
          clearInterval(idIntervalCourir);
          ninja.positionCoup();
          shuriken[0].lancer();
          ninjaCourSansLancerDeShuriken = false;
          break;
      };
    }

  };

  function clavierKeyUp(event) {
    var code = event.keyCode;

    if (ninjaVivant && finDeJeu === false) {
      switch (code) {

        case 37:// fleche gauche
          clearInterval(idIntervalCourir);
          ninja.positionInitiale();
          animationNinja = false;
          break;

        case 39://fleche droite
          ninja.positionInitiale();
          clearInterval(idIntervalCourir);
          animationNinja = false;
          break;

        case 32://espace
          ninja.positionInitiale();
          clearInterval(idIntervalCourir);
          lancerShurikenSansCourir = false;
           break;
      };
    }

  };


});