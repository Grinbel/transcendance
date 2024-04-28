import { IoSettingsOutline } from "react-icons/io5";
import { TbFriends } from "react-icons/tb";
import { AiOutlineHistory } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";

const marioAvatar = '../../../public/players.jpg';
const yoshiAvatar = '../../../public/yoshi.jpg';
const princessAvatar = '../../../public/princess.jpg';
const badAvatar = '../../../public/badboy.png';


export const sidebar = [
	{
	  id: 1,
	  title: "Dashboard",
	  listItems: [
		{
		  id: 1,
		  title: "Main",
		  url: "/dashboard",
		  icon: IoHomeOutline,
		},
		{
		  id: 2,
		  title: "Settings",
		  url: "settings",
		  icon: IoSettingsOutline,
		},
		{
			id: 3,
			title: "Friends",
			url: "friends",
			icon: TbFriends,
		  },
		  {
			id: 4,
			title: "History",
			url: "history",
			icon: AiOutlineHistory,
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
				avatar: badAvatar,
				alias: "chokapik",
				rank: 23,
			},
		},

		{
			id: 2,
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
				avatar: yoshiAvatar,
				alias: "ananas",
				rank: 9000
			},
	},
	];