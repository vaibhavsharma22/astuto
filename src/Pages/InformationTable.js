import React, { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { TextField, MenuItem, Select, Avatar, Chip } from "@mui/material";
import { debounce } from "lodash";
import tableSchema from "../TableSchema.json";
import tableData from "../TableData.json";

const InformationTable = () => {
  const [schema, setSchema] = useState(tableSchema);
  const [data, setData] = useState(tableData);
  const [filters, setFilters] = useState({ name: "", role: [] });
  const [selectedRows, setSelectedRows] = useState({});

  // Debounced Search Filter
  const debouncedSearch = debounce((value) => {
    setFilters((prev) => ({ ...prev, name: value }));
  }, 1000);

  // Filtering Data
  const filteredData = data?.filter((row) => {
    return (
      row.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      (filters.role.length === 0 || filters.role.includes(row.role))
    );
  });

  // Define Columns Based on Schema
  const columns = schema?.map((col) => ({
    accessorKey: col.key,
    header: col.label,
    Cell: ({ cell }) => {
      if (col.type === "image") return <Avatar src={cell.getValue()} />;
      if (col.type === "badge") {
        return <Chip label={cell.getValue()} color="primary" />;
      }
      if (col.type === "tags") {
        return (cell.getValue() || []).map((tag, id) => (
          <Chip key={id} label={tag} />
        ));
      }
      return cell.getValue();
    },
  }));

  return (
    <div style={{ paddingTop: "10px" }}>
      <TextField
        label="Search Name"
        variant="outlined"
        onChange={(e) => debouncedSearch(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Select
        multiple
        value={filters.role}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, role: e.target.value }))
        }
        displayEmpty
        style={{ marginLeft: "10px", minWidth: "200px" }}
      >
        <MenuItem value="">All Roles</MenuItem>
        {Array.from(new Set(data?.map((item) => item.role))).map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </Select>
      <MaterialReactTable
        columns={columns}
        data={filteredData}
        enableSorting
        enablePagination
        enableRowSelection
        state={{ selectedRows }}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id.toString()}
        initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
        muiTableBodyRowProps={({ row }) => ({
          selected: selectedRows[row.id],
        })}
      />
      Selected Rows Output
      <div style={{ marginTop: "10px" }}>
        <h3>Selected Rows:</h3>
        {Object.keys(selectedRows).length > 0 ? (
          <ul>
            {Object.keys(selectedRows).map((rowId) => (
              <li key={rowId}>{rowId}</li>
            ))}
          </ul>
        ) : (
          <p>No rows selected.</p>
        )}
      </div>
    </div>
  );
};

export default InformationTable;
