import { IoSettingsOutline } from "react-icons/io5";
import { TbFriends } from "react-icons/tb";
import { AiOutlineHistory } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";

const marioAvatar = '../../../public/players.jpg';
const yoshiAvatar = '../../../public/yoshi.jpg';
const princessAvatar = '../../../public/princess.jpg';
const badAvatar = '../../../public/badboy.png';
const pathImage = "../../../public/ponge.jpg"

export const sidebar = [
	{
	  id: 1,
	  title: "Dashboard",
	  listItems: [
		{
		  id: 1,
		  title: "Settings",
		  url: "settings",
		  icon: IoSettingsOutline,
		},
	  ],
	},
  ];
  

  export const tournaments = [
		{	
			id: 1,
			title: "deathmatch",
			date: "2021-08-01",
			players: 10,
			winner: "Xavier benoit",
		},
		{	
			id: 2,
			title: "BreakTheWall",
			date: "2021-08-02",
			players: 10,
			winner: "marco",
		},
		{	
			id: 3,
			title: "PiscineFight",
			date: "2021-08-03",
			players: 10,
			winner: "Polo",
		},
		{	
			id: 4,
			title: "ClashOfClusters",
			date: "2021-08-04",
			players: 10,
			winner: "bebeu",
		}
	];


	export const friends = [
		{	
			id: 1,
			name: "Maario",
			avatar: marioAvatar,
			alias: "chokapik",
			rank: 1
		},
		{
			id: 2,
			name: "Luigi",
			avatar: marioAvatar,
			alias: "chokapik",
			rank: 23
		},
		{
			id: 3,
			name: "pomko",
			avatar: marioAvatar,
			alias: "popo",
			rank: 300
		},
		{
			id: 4,
			name: "cacao",
			avatar: yoshiAvatar,
			alias: "ananas",
			rank: 9000
		},
	];


	export const games = [
		{
			id:1,
			date: "2021-08-01",
			score: "10-0",
			tournament: "deathmatch",
			gameRank: "final",
			winner: "Maario",
			player1:{	
				id: 1,
				name: "Maario",
				avatar: marioAvatar,
				alias: "chokapik",
				rank: 1,

			},
			player2:{
				id: 2,
				name: "Luigi",
				avatar: yoshiAvatar,
				alias: "chokapik",
				rank: 23,
			},
		},

		{
			id: 2,
			date: "2021-08-02",
			score: "10-30",
			tournament: "deathmatch",
			gameRank: "final",
			player1:{
					id: 1,
					name: "pomko",
					avatar: princessAvatar,
				alias: "popo",
				rank: 300
			},
			player2:{
				id: 2,
				name: "cacao",
				avatar: badAvatar,
				alias: "ananas",
				rank: 9000
			},
	},
	{
		id: 3,
		date: "2021-08-04",
		score: "5-20",
		gameRank: "final",
		player1:{
				id: 1,
				name: "pomko",
				avatar: badAvatar,
			alias: "popo",
			rank: 300
		},
		player2:{
			id: 2,
			name: "cacao",
			avatar: yoshiAvatar,
			alias: "ananas",
			rank: 9000
		},
},
	];


	export const friendRows = [
		{ id: 1, alias: 'Snow', firstName: 'Jon', age: 14 , avatar:pathImage, status:true},
		{ id: 2, alias: 'Lannister', firstName: 'Cersei', age: 31 , avatar:null},
		{ id: 3, alias: 'Lannister', firstName: 'Jaime', age: 31 , avatar:pathImage},
		{ id: 4, alias: 'Stark', firstName: 'Arya', age: 11 , avatar:pathImage},
		{ id: 5, alias: 'Targaryen', firstName: 'Daenerys', age: null , avatar:pathImage},
		{ id: 6, alias: 'Melisandre', firstName: null, age: 150 , avatar:pathImage},
		{ id: 7, alias: 'Clifford', firstName: 'Ferrara', age: 44 , avatar:pathImage},
		{ id: 8, alias: 'Frances', firstName: 'Rossini', age: 36 , avatar:pathImage},
		{ id: 9, alias: 'Roxie', firstName: 'Harvey', age: 65 , avatar:null},
	  ];

	  export const historygames = [
		{
			id:1,
			date: "2021-08-01",
			score: "10-0",
			tournament: "deathmatch",
			gameRank: "final",
			winner: "Maario",
			player1:{	
				id: 1,
				name: "Maario",
				avatar: marioAvatar,
				alias: "chokapik",
				rank: 1,

			},
			player2:{
				id: 2,
				name: "Luigi",
				avatar: yoshiAvatar,
				alias: "chokapik",
				rank: 23,
			},
		},

		{
			id: 2,
			date: "2021-08-02",
			score: "10-30",
			tournament: "deathmatch",
			gameRank: "final",
			player1:{
					id: 1,
					name: "pomko",
					avatar: princessAvatar,
				alias: "popo",
				rank: 300
			},
			player2:{
				id: 2,
				name: "cacao",
				avatar: badAvatar,
				alias: "ananas",
				rank: 9000
			},
	},
	{
		id: 3,
		date: "2021-08-04",
		score: "5-20",
		gameRank: "final",
		player1:{
				id: 1,
				name: "pomko",
				avatar: badAvatar,
			alias: "popo",
			rank: 300
		},
		player2:{
			id: 2,
			name: "cacao",
			avatar: yoshiAvatar,
			alias: "ananas",
			rank: 9000
		},
},
{
	id:4,
	date: "2021-08-01",
	score: "10-0",
	tournament: "deathmatch",
	gameRank: "final",
	winner: "Maario",
	player1:{	
		id: 1,
		name: "Maario",
		avatar: marioAvatar,
		alias: "chokapik",
		rank: 1,

	},
	player2:{
		id: 2,
		name: "Luigi",
		avatar: yoshiAvatar,
		alias: "chokapik",
		rank: 23,
	},
},

{
	id: 5,
	date: "2021-08-02",
	score: "10-30",
	tournament: "deathmatch",
	gameRank: "final",
	player1:{
			id: 1,
			name: "pomko",
			avatar: princessAvatar,
		alias: "popo",
		rank: 300
	},
	player2:{
		id: 2,
		name: "cacao",
		avatar: badAvatar,
		alias: "ananas",
		rank: 9000
	},
},
{
id: 6,
date: "2021-08-04",
score: "5-20",
gameRank: "final",
player1:{
		id: 1,
		name: "pomko",
		avatar: badAvatar,
	alias: "popo",
	rank: 300
},
player2:{
	id: 2,
	name: "cacao",
	avatar: yoshiAvatar,
	alias: "ananas",
	rank: 9000
},
},
	];