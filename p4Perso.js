
// CREATION DE LA CLASSE (OBJET), INSTANCIER ET ASSIGNEE A ID "GAME" + LA FONCTION CLICK ET LE CHARGEMENT DE LA PAGE !! 
$("#game").ready(function(){
	const p4 = new P4("#game");

		$("#restart").on("click", function(){
		$("#game").empty();
		p4.drawGame();
	});

		$("#annuleLast").click(function(){
			
		})
}); 

// ON DECLARE UNE CLASS POUR NOTRE JEU !!
	class P4 {
	constructor(selector){
		this.COL = 7; // fonction colonnes 
		this.LGN = 6; // fonction lignes 
		this.selector = selector;
		this.player = "red"; // fonction des joueurs ! Ici jaune donc l'autre est jaune 
		this.drawGame(); // fonction qui dessine la grille de jeu et renvoie les datas des cellules de la grille
		this.ecoute(); // fonction qui écoute les cellules et renvoie les datas (emplacement)
		this.checkWin(); // fonction pour vérifier gagnant
	} 
// ON COMMENCE PAR DESSINER LA GRILLE DU JEU AVEC UNE DOUBLE BOUCLE FOR !! UNE POUR LIGNE ET UNE POUR COLONNE !!
	drawGame(){
		const $jeu = $(this.selector); //   Créé une variable JEU pour garder en mémoire la classe de base

		for(let lgn=0; lgn < this.LGN; lgn++){ // Double boucle pour afficher les colonnes dans les lignes et le nombre de ligne nécessaire !!
		const $lgn = $("<div>").addClass("lgn"); // On désigne qu'est ce que "lgn", c'est une DIV, et veux que ce soit une ligne, on ajoute une Class ligne "lgn" !
			for(let col = 0; col < this.COL; col ++){
		 	const $col = $("<div>").addClass("col empty").attr("data-col", col).attr("data-lgn", lgn);  // On désigne les colonnes,"col", on ajoute une class pour gérer la couleur avec CSS et un attribut pour stocker son endroit ! 
				$lgn.append($col); // on ajoute (append) cette colonne (col) dans la ligne (lgn) !! (append)
				}
			$jeu.append($lgn); // on ajoute (append) la ligne (lgn) dans le jeu (const $jeu) !! (append)
		}
	} // LE TABLEAU EST DESSINé A PARTIR D'ICI !! 
 

// CETTE FONCTION VA RETOURNE LA DERNIERE CASE VIDE !!
// ON CREE this.ecoute pour les clics, les emplacements de chaques cases.

	ecoute(){
		const $jeu = $(this.selector); // informe que la variable jeu est égale à la class selector qui est le plus haut (drawgame) !!
		const that = this; // On créé la variable that pour l'associé à this pour l'utiliser et la renvoyer à des focntions !!

		function lastCase(col){ // cette fonction (évement) va retourner la derniere colonne vide du tableau 
			
			const $cells = $(`.col[data-col="${col}"]`); // va retourner toutes les data comme lui
				for(let i = $cells.length -1; i >=0; i--){ // boucle pour parcourir le tableau, -1 pour aller tout en bas !!
					const $cell = $($cells[i]); // stock la variable cell dans cells et parcours le tableau 
					if($cell.hasClass("empty")){ // si la cellule est vide, retourne 
						return $cell;
					}
				}
				return null;
			}  

// ON UTILISE MAINTENANT LA FONCTION "lastCase" POUR ECOUTER SUR LES COLONNES VIDES 			
		$jeu.on("mouseenter", ".col.empty", function(){ // mouseenter sur .col, verifie si .empty en css, function vide
			const $col = $(this).data("col"); // recupère la colonne quand la sourie rentre grace à sa data !! Et this pour dire que l'on veut CELLE-CI !! 
			const $last = lastCase($col); // on applique la fonction lastCase sur col
			if($last != null){ // si il est pas null (vide)
				$last.addClass(`p${that.player}`); // on lui ajoute la class player pour le rappeler plus tard 
			}
		});
// ON CREE UNE FONCTION INVERSE, LORSQUE LA SOURIE SORT !! 
		$jeu.on("mouseleave", ".col", function(){ // pas besoin de verifier si vide, juste si .col
			$(".col").removeClass(`p${that.player}`); // sur la col on lui retire la class player
		});
// ICI ON CREE LES JOUEURS ET AJOUTE PLAYER AU CONSTRUTOR 		
// ON  VERIFIE LE CLICK, SI CASE VIDE, EXCUSE FONCTION   
		$jeu.on("click", ".col.empty", function(){
			const col = $(this).data("col");
			const $last = lastCase(col);
				$last.addClass(`${that.player}`).removeClass(`empty p${that.player}`).data("player", `${that.player}`);
		
			const winner = that.checkWin($last.data("lgn"), $last.data("col")); // on verifie si il y a un gagnant ! 
				that.player = (that.player === "red") ? "yellow" : "red"; // si joueur vaut rouge alors passe à jaune et si jaune passe à rouge !!
				
				if(winner){
					alert("VOUS AVEZ GAGNE !!");
					return;
				}
			});

		}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// CETTE FONCTION VA VERIFIER SI IL Y A UN GAGNANT
	checkWin(lgn, col){ // on a besoin des lignes et colonnes en arguments 
		const that = this; // variable on lui dit que that est égale à this 

		function $getCell(i, j){ // cette fonction va nous retourner la cellule qui correspond aux coordonnées html (data) !! ligne on appellera i et colonne on appellera j 
			return $(`.col[data-lgn="${i}"][data-col="${j}"]`); // blackquotes 
		}
// CETTE FONCTION VA VERIFIER LES DIRECTIONS
		function checkDirection(direction){
			let total = 0; 
			let i = lgn + direction.i; 
			let j = col + direction.j;
			let $next = $getCell(i, j); // renvoie a la function getCell pour obtenir la data
			while(i >= 0 && i < that.LGN && j >= 0 && j < that.COL && $next.data("player") === that.player){ // boucle tant que i supérieur à 0 et que les lignes correspondent aux 6 de départ ! pareil avec pour j ! Pour pas qui dépasse du tableau ! On veut le data.player pour vérifier que les pions correspondent au bon joueur !      
				total++; // si la boucle est ok on incrémente et passe à une autre cellule du tableau
				i += direction.i; 
				j += direction.j;
				$next = $getCell(i, j); 
			}
			return total;
		}
// VERIFIE SI IL Y A UN GAGNANT DANS DIFFERENTES DIRECTIONS !!
		function checkWin(directionA, directionB){
			const total = 1 + checkDirection(directionA) + checkDirection(directionB);
			if(total >=4){ 
				return that.player;
			}else{
				return null;
			}
		}
// HORIZONTALE C'EST LES COLONNES !!
		function checkHorizontale(){
			return checkWin({i : 0, j: -1}, {i : 0, j: 1});
		}
// VERTICALE C'EST LES LIGNES !!
		function checkVerticale(){
			return checkWin({i : -1, j: 0}, {i : 1, j: 0});
		}
// DIAGONALE DANS UN SENS !!
		function checkDiagonale1(){
			return checkWin({i : 1, j: 1}, {i : -1, j: -1});
		}
// DIAGONALE DANS L'AUTRE SENS  !! 
		function checkDiagonale2(){
			return checkWin({i : 1, j: -1}, {i : -1, j: 1});
		}
		return checkHorizontale() || checkVerticale() || checkDiagonale1() || checkDiagonale2();
	}

}