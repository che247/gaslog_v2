import { CheckCircle } from "@mui/icons-material";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import InputAdornment from "@mui/material/InputAdornment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Graph } from "../../components/Graph/component.graph.jsx";
import "./Home.css";
import { Close, Edit } from "@mui/icons-material";
import {
  Alert,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
} from "@mui/material";

const filter = createFilterOptions();

export default function Home() {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toLocaleString();
  });

  const initial = {
    odometer: "",
    price: "",
    gallons: "",
    gas_station: "",
  };
  const reset = () => {
    console.log("Resetting fields!");
    setForm(initial);
  };
  const [form, setForm] = useState(initial);

  const [customGasStation, setCustomGasStation] = useState("");
  const [inputGasStationValue, setInputGasStationValue] = useState("");
  const [gasStations, setGasStations] = useState([]);
  const [fuelRecords, setFuelRecords] = useState([]);
  const [afterID, setAfterID] = useState();
  const [hasNext, setHasNext] = useState();
  const [toggleOpen, setToggleOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(initial);
  const [editRecordConfirm, setEditRecordConfirm] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(initial);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  useEffect(() => {
    fetchGasStations();
    // Let's get the records of all gas fuel ups so far
    fetchFuelRecords();
  }, []);

  useEffect(() => {
    console.log("Got a new update to fuel records: ", fuelRecords);
  }, [fuelRecords]);

  const changeGasStation = (e) => {
    const value = e.target.value;
    setSelectedGasStation(value);
    if (value !== "other") setCustomGasStation("");
  };

  const clearAllOptions = () => {
    reset();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("We are now attempting to submit!");
    if (!editRecord) return;

    try {
      const res = await axios.patch(`/api/logs/${editRecord.id}`, editRecord);
      const updatedRecord = res.data;

      setEditOpen(false);
      setEditRecord(initial);
      setEditRecordConfirm(true);
      setFuelRecords((prev) =>
        prev.map((record) => (record.id === updatedRecord.id ? updatedRecord : record)),
      );
    } catch (err) {
      console.error("Unable to update records on backend services due to error: ", err);
    }
  };

  const requestDelete = (record) => {
    setConfirmDeleteOpen(true);
    setDeleteRecord(record);
  };

  const handleDelete = async (recordID) => {
    try {
      const res = await axios.delete(`/api/logs/${recordID}`);
      if (res.status === 200) {
        setFuelRecords((prev) => prev.filter((record) => record.id !== recordID));
      }
    } catch (err) {
      console.error(
        "Unable to delete. Backend Service is temporarily unavailable... Try again later.",
        err,
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteRecord) return;

    try {
      await handleDelete(deleteRecord.id);
      setConfirmDeleteOpen(false);
      setEditOpen(false);
      setEditRecord(initial);
      setDeleteConfirmation(true);
    } catch (err) {
      console.error("Unable to delete record due to error: ", err);
    }
  };

  const handleAddCustomGasStation = (cleaned) => {
    console.log("Got the custom gas station: ", cleaned);
    const addRegex = /^[aA]dd\s(.+[^?])\??$/;
    const match = cleaned.match(addRegex);
    const raw = match ? match[1] : cleaned;
    const raw_cleaned = raw.trim();
    setGasStations((prev) => [...prev, raw_cleaned]);
    setInputGasStationValue(raw_cleaned);
    setForm((prev) => ({ ...prev, gas_station: raw_cleaned }));
    setToggleOpen(false);
  };

  const handleNewGasStationClose = () => {
    console.log("Removing bad option...");
    setForm((prev) => ({ ...prev, gas_station: "" }));
    setInputGasStationValue("");
    setToggleOpen(false);
  };

  const fetchGasStations = async () => {
    try {
      const res = await axios.get("/api/gasStations");
      const gas_stations = res.data.flatMap((gas_station) => Object.values(gas_station));
      setGasStations(gas_stations);
    } catch {
      console.error("Unable to get gas stations. Please try again later");
    }
  };

  const fetchFuelRecords = async () => {
    try {
      const res = await axios.get("/api/logs");
      console.log(res.data);
      setFuelRecords(res.data.data);
      setAfterID(res.data.meta.endCursor);
      setHasNext(res.data.meta.hasNextPage);
    } catch {
      console.error("Unable to get fuel records. Please try again later");
    }
  };

  const loadMoreFuelRecords = async () => {
    try {
      const res = await axios.get("/api/logs", {
        params: { afterID: afterID },
      });
      console.log("Got some more records: ", res.data);
      setFuelRecords((prev) => [...prev, ...res.data.data]);
      setAfterID(res.data.meta.endCursor);
      setHasNext(res.data.meta.hasNextPage);
    } catch {
      res.send(500).json({ err: "Unable to load more records. Womp womp..." });
    }
  };

  const createFuelRecordsData = (
    id,
    date,
    odometer,
    price,
    gallons,
    price_per_gallon,
    gas_station,
  ) => {
    return {
      id,
      date_display: new Date(date).toLocaleDateString(),
      odometer,
      price,
      gallons,
      price_per_gallon,
      gas_station,
    };
  };

  const rows = useMemo(
    () =>
      fuelRecords.map((r) =>
        createFuelRecordsData(
          r.id,
          r.date,
          r.odometer,
          r.total_cost,
          r.gallons,
          r.price_per_gallon,
          r.gas_station,
        ),
      ),
    [fuelRecords, createFuelRecordsData],
  );

  const uploadLog = async () => {
    try {
      const payload = {
        date: date,
        odometer: form.odometer,
        total_cost: form.price,
        gallons: form.gallons,
        gas_station: form.gas_station,
        price_per_gallon: (form.price / form.gallons).toFixed(2),
      };
      try {
        const res = await axios.post("/api/log", payload);
        clearAllOptions();
        fetchFuelRecords();
      } catch (err) {
        console.log("Error. Unable to post upload log due to error: ", err);
      }
    } catch {
      console.error("Unable to upload log. Please try again later");
      alert("Unable to upload log. Please try again later");
    }
  };

  return (
    <>
      <div id="title">
        <h1>Gas Log</h1>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <form className="form_elements">
          <div className="form">
            <TextField
              variant="outlined"
              type="date"
              id="date"
              name="date"
              value={date}
              defaultValue={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="end">
                      <CalendarMonth />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <div className="form">
            <TextField
              label="Odometer"
              type="number"
              id="odometer"
              name="odometer"
              value={form.odometer}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  odometer: Number(e.target.value),
                }));
              }}
            />
          </div>
          <div className="form">
            <TextField
              label="Price"
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, price: Number(e.target.value) }));
              }}
            />
          </div>
          <div className="form">
            <TextField
              label="Gallons"
              type="number"
              id="gallons"
              name="gallons"
              value={form.gallons}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, gallons: Number(e.target.value) }));
              }}
            />
          </div>
          <div className="form">
            <Autocomplete
              freeSolo
              label="Gas Station"
              disablePortal
              options={gasStations}
              inputValue={inputGasStationValue}
              onInputChange={(event, newValue) => {
                setInputGasStationValue(newValue);
              }}
              value={form.gas_station}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  const cleaned = newValue.trim().toLowerCase();
                  if (cleaned && !gasStations.some((g) => g.toLowerCase() === cleaned)) {
                    console.log("Setting the custom gas station to: ", cleaned);
                    setCustomGasStation(cleaned);
                    setToggleOpen(true);
                  } else {
                    setForm((prev) => ({ ...prev, gas_station: cleaned }));
                  }
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const value = params.inputValue.trim();
                const exists = options.some(
                  (option) => option.toLowerCase() === value.toLowerCase(),
                );
                if (value && !exists) {
                  filtered.push(`Add ${value}?`);
                }
                return filtered;
              }}
              renderInput={(params) => <TextField {...params} label="Gas Station" />}
            />
          </div>
        </form>
      </div>
      <div style={{ textAlign: "right", marginTop: "1rem" }}>
        <Button
          variant="contained"
          onClick={uploadLog}
          disabled={Object.values(form).some((value) => value === "" || value == null)}
        >
          Submit
        </Button>
      </div>
      <div style={{ marginTop: "2rem", margin: "2rem auto 0" }}>
        <h2 style={{ textAlign: "left" }}>Previous Fuel Records</h2>
        <TableContainer className="table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Edit</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Odometer</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Gallons</TableCell>
                <TableCell>Price/Gallon</TableCell>
                <TableCell>Gas Station</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...rows]
                .sort((a, b) => new Date(b.date_display) - new Date(a.date_display))
                .map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <IconButton
                        aria-label="Edit"
                        color="primary"
                        onClick={() => {
                          setEditOpen(true);
                          setEditRecord(record);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>{record.date_display}</TableCell>
                    <TableCell>{record.odometer}</TableCell>
                    <TableCell>${Number(record.price).toFixed(2)}</TableCell>
                    <TableCell>{record.gallons}</TableCell>
                    <TableCell>${Number(record.price_per_gallon).toFixed(2)}</TableCell>
                    <TableCell>{record.gas_station}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {hasNext ? (
          <Button variant="contained" onClick={loadMoreFuelRecords} style={{ marginTop: "1rem" }}>
            Load More
          </Button>
        ) : (
          <Button
            disabled
            variant="contained"
            onClick={loadMoreFuelRecords}
            style={{
              marginTop: "1rem",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              color: "black",
            }}
          >
            All Logs Have Been Displayed
          </Button>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Graph type="line" />
        </div>
      </div>
      <Dialog open={toggleOpen} onClose={handleNewGasStationClose}>
        <DialogTitle>
          Add new gas station{form.gas_station ? ` ${form.gas_station}` : ""}?
        </DialogTitle>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "space-evenly",
          }}
        >
          <Button onClick={handleNewGasStationClose} color="error">
            Cancel
          </Button>
          <Button onClick={() => handleAddCustomGasStation(customGasStation)}>Confirm</Button>
        </div>
      </Dialog>
      <Dialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          Edit Record
          <IconButton color="error" sx={{ marginLeft: "auto" }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              flexDirection: "column",
              margin: "0.5rem",
              gap: "0.5rem",
            }}
          >
            <TextField
              variant="outlined"
              type="date"
              id="date"
              name="date"
              value={editRecord.date_display}
              onChange={(e) => {
                setEditRecord((prev) => ({ ...prev, date_display: e.target.value }));
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="end">
                      <CalendarMonth />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Odometer"
              type="number"
              id="odometer"
              name="odometer"
              value={editRecord.odometer}
              onChange={(e) => {
                setEditRecord((prev) => ({
                  ...prev,
                  odometer: Number(e.target.value),
                }));
              }}
            />
            <TextField
              label="Price"
              type="number"
              id="price"
              name="price"
              value={editRecord.price}
              onChange={(e) => {
                setEditRecord((prev) => ({ ...prev, price: Number(e.target.value) }));
              }}
            />
            <TextField
              label="Gallons"
              type="number"
              id="gallons"
              name="gallons"
              value={editRecord.gallons}
              onChange={(e) => {
                setEditRecord((prev) => ({ ...prev, gallons: Number(e.target.value) }));
              }}
            />
            <Autocomplete
              freeSolo
              label="Gas Station"
              disablePortal
              options={gasStations}
              inputValue={inputGasStationValue}
              onInputChange={(event, newValue) => {
                setInputGasStationValue(newValue);
              }}
              value={editRecord.gas_station}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  const cleaned = newValue.trim().toLowerCase();
                  if (cleaned && !gasStations.some((g) => g.toLowerCase() === cleaned)) {
                    console.log("Setting the custom gas station to: ", cleaned);
                    setCustomGasStation(cleaned);
                    setToggleOpen(true);
                  } else {
                    setEditRecord((prev) => ({ ...prev, gas_station: cleaned }));
                  }
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const value = params.inputValue.trim();
                const exists = options.some(
                  (option) => option.toLowerCase() === value.toLowerCase(),
                );
                if (value && !exists) {
                  filtered.push(`Add ${value}?`);
                }
                return filtered;
              }}
              renderInput={(params) => <TextField {...params} label="Gas Station" />}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" onClick={() => requestDelete(editRecord)} color="error">
                Delete
              </Button>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
      <Dialog open={confirmDeleteOpen}>
        <DialogTitle>Confirm Delete?</DialogTitle>
        <DialogContent>This cannot be undone.</DialogContent>
        <DialogActions>
          <Button color="primary" variant="outlined" onClick={() => setConfirmDeleteOpen(false)}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={deleteConfirmation}
        autoHideDuration={3000}
        onClose={() => setDeleteConfirmation(false)}
        message="Record Deleted"
      ></Snackbar>
      <Snackbar
        open={editRecordConfirm}
        autoHideDuration={3000}
        onClose={() => setEditRecordConfirm(false)}
        message={
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            Complete
            <CheckCircle color="success" />
          </div>
        }
      ></Snackbar>
    </>
  );
}
