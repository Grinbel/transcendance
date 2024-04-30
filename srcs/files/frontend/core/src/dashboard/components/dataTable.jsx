import "./dataTable.scss"
import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';



import { TbLockOpenOff } from "react-icons/tb";
import { FaRegEye } from "react-icons/fa";


const DataTable = ({data}) => {

	
	const actionColumn = {
		field:'action',
		headerName:'Action',
		width: 150,
		renderCell: (params) => {
			console.log('path', `/${data.linkPath}/${params.row.id}`);
			return (
				<div className="actions">
					<Link to={`/${data.linkPath}/${params.row.id}`} id="eyeButton">
						< FaRegEye id="eyeIcon" />
					</Link>
					<button onClick={() => console.log('Icon clicked to delete user!')} id="deleteButton">
						<TbLockOpenOff id="deleteIcon" />
					</button>
					<link rel="stylesheet" href="" />
				</div>
			)
		}
	}

	return (
		<div className="dataTable">
			<DataGrid
				className="dataGrid"
				rows={data.rows}
				columns={[...data.columns, actionColumn]}
				initialState={{
				pagination: {
					paginationModel: {
					pageSize: 10,
					},
				},
				}}
				slots={{ toolbar: GridToolbar }}
				slotProps={{ 
					toolbar:	{	
									csvOptions: { disableToolbarButton: true },
									printOptions: { disableToolbarButton: true },
									showQuickFilter: true,
									quickFilterProps: { debounceMs: 250 },
								},
		
							}}
				pageSizeOptions={[5]}
				checkboxSelection
				disableRowSelectionOnClick
				disableColumnFilter
				disableColumnSelector
				disableDensitySelector
				disableExport
			/>
		</div>
	);
}

export default DataTable;