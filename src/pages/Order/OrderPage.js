import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Select,
  Typography,
  IconButton,
  FormControl,
  Box,
  InputLabel,
  TableContainer,
  TablePagination,
  TextField
} from '@mui/material';
// components
import Label from '../../components/label/Label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { ModalConfirmOrder } from '../../components/modal/modal';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/user';
import api from '../../utils/api';
import { AppContext } from '../../context/context';
import MyOrderNote from 'src/components/InvoiceReciepment/order-note';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'description', label: 'Nome', alignRight: false },
  { id: 'imbl_awb', label: 'BL/AWB', alignRight: false },
  { id: 'reference', label: 'Referência', alignRight: false },
  { id: 'actions', label: 'Acção', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OrderPage() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate()
  const [page, setPage] = useState(0);
  const [actualState, setActualState] = useState("Em curso");
  const { userData, curentWarehouse } = useContext(AppContext)
  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [actualId, setActualId] = useState(0);
  const [stateOrder, setStateOrder] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState(0);
  const handleOpenMenu = (event, id, state) => {
    setOpen(event.currentTarget);
    setActualId(id)
    setActualState(state);
    setId(id);

  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const [search, setSearch] = useState("")
  useEffect(() => {
    const getData = async () => {
      try {
        if (search.length <= 1) {
          const url = `/order?warehouseId=${curentWarehouse.id ?? curentWarehouse}&state=${stateOrder}`;
          const response = await api.get(url)
          setData([])
          setData(response.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [search, curentWarehouse, stateOrder])
  const handleSearch = async () => {
    try {

      const url = `/order?searchParam=${search}`;
      const response = await api.get(url)
      setData([])

      setData(response.data)
      console.log(response.data)

    } catch (e) {
      console.log(e)
    }
  }
  const handleChange = async (e) => {
    setStateOrder(e.target.value)
    try {
      const url = e.target.value === "Todos" ? "/order" : `/order?state=${e.target.value}&warehouseId=${curentWarehouse.id ?? curentWarehouse}`
      const response = await api.get(url)
      setData([])

      setData(response.data)
      console.log(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleGenerateInvoiceOrder = async () => {
    const url = `/order/${actualId}`
    const response = await api.get(url)
    MyOrderNote(response.data)
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const [data, setData] = useState([])
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;
  const getData = async (url) => {
    try {
      const response = await api.get(url)
      setData([])
      setData(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getData(`/order?warehouseId=${curentWarehouse?.id ?? curentWarehouse}&state=Em Curso`)
  }, [])

  useEffect(() => {
    getData(`/order?warehouseId=${curentWarehouse?.id ?? curentWarehouse}`)
  }, [curentWarehouse])

  return (
    <>
      <Helmet>
        <title> Encomendas </title>
      </Helmet>

      <Container>
        <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
          Início {'>'} Encomendas
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={5}>
          <Typography variant="h4" gutterBottom>
            Gestão de Encomendas
          </Typography>
          {userData.data.position !== "3" && <Button variant="contained" onClick={() => { navigate("/dashboard/encomenda/cadastrar") }} startIcon={<Iconify icon="eva:plus-fill" />}>
            Cadastrar Encomenda
          </Button>}
        </Stack>


        <Stack direction="row" sx={{ width: '100%', justifyContent: "space-between", alignItems: 'center', alignContent: "center", marginBottom: "50px" }} >
          <Box sx={{ minWidth: '50%' }}>

            <FormControl variant="standard" sx={{ m: 1, width: '90%', marginRight: '50px' }}>
              <InputLabel id="demo-simple-select-standard-label">Estado da Encomenda</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={stateOrder}
                label="Estado da Encomenda"
                onChange={handleChange}
              >
                <MenuItem value={'Todos'}>Todos</MenuItem>
                <MenuItem value={'Em Curso'}>Em Curso</MenuItem>
                <MenuItem value={'Finalizada'}>Finalizada</MenuItem>
                <MenuItem value={'Finalizada Parcialmente'}> Finalizada Parcialmente </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: '60%' }}>
            <TextField variant="standard" onChange={(e) => { setSearch(e.target.value); }} label="Pesquisar pelo BL/AWB ou Descrição da Encomenda" type="email" sx={{ minWidth: "60%" }} />
            <Button variant="contained" onClick={() => { handleSearch() }} startIcon={<Iconify icon="eva:search-fill" />}>
              Pesquisar
            </Button>
          </Box>
        </Stack>

        <Card>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}

                />
                <TableBody>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, description, imbl_awb: imblAwb, state, reference } = row;
                    const selectedUser = selected.indexOf(description) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>


                        <TableCell align="left">{description}</TableCell>

                        <TableCell align="left">{imblAwb}</TableCell>
                        <TableCell align="left">{reference}</TableCell>

                        <TableCell align="left">
                          <Label color={state === 'Finalizada' ? 'info' : state.toLowerCase() === 'finalizada parcialmente' ? 'warning' : state.toLowerCase() === 'rejeitada' ? 'error' : 'success'}>{sentenceCase(state)}</Label>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => { handleOpenMenu(e, id, state) }}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>

                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {data.length === 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Nenhum resultado para mostrar
                          </Typography>


                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            rowsPerPage={rowsPerPage}
            count={data.length}
            labelRowsPerPage={"Linhas por página"}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
              },
            },
          }}
        >
          <MenuItem onClick={() => { navigate(`/dashboard/encomenda/editar/${actualId}`) }}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Ver mais
          </MenuItem>
          <MenuItem onClick={() => { handleGenerateInvoiceOrder() }}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Imprimir
          </MenuItem>
          {userData.data.position !== "1" && !actualState.toLowerCase().includes("finalizada") && <MenuItem onClick={() => { navigate(`/dashboard/confirmar-encomenda/${id}`) }}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Confirmar
          </MenuItem>}
        </Popover>
      </Container >



      <ModalConfirmOrder
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        id={id}
      />
    </>
  );
}
