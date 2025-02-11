// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const iconPng = (name) => <SvgColor src={`/assets/icons/navbar/${name}.png`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
    permission: ["1", "2", "3"]

  },
  {
    title: 'Requisições',
    path: '/dashboard/requisicao',
    icon: iconPng('pedido'),
    permission: ["1", "2"]

  },
  {
    title: 'Requisições',
    path: '/dashboard/requisicao/minhas',
    icon: iconPng('pedido'),
    permission: ["3"]

  },
  {
    title: 'Encomendas',
    path: '/dashboard/encomenda',
    icon: iconPng('caixa-de-entrega'),
    permission: ["1", "2", "3"]
  },
  {
    title: 'Notas de Entrega',
    path: '/dashboard/notas-entrega',
    icon: iconPng('nota-de-entrega'),
    permission: ["1", "2", "3"]

  },
  {
    title: 'Utilizadores',
    path: '/dashboard/usuario',
    icon: iconPng('user'),
    permission: ["1"]

  },
  {
    title: 'Auditoria',
    path: '/dashboard/auditoria',
    icon: iconPng('log'),
    permission: ["1", "2"]

  },

  {
    title: 'Armazéns',
    path: '/dashboard/armazem',
    icon: iconPng('containers'),
    permission: ["1", "2"]

  },
  {
    title: 'Peças',
    path: '/dashboard/peca',
    icon: iconPng('pecas-de-reposicao'),
    permission: ["1", "2", "3"]

  },
  {
    title: 'Categorias',
    path: '/dashboard/categoria',
    icon: iconPng('categorizacao'),
    permission: ["1", "2"]

  },

  {
    title: 'Fornecedores',
    path: '/dashboard/fornecedor',
    icon: iconPng('encomenda-expressa'),
    permission: ["1", "2"]

  },
  {
    title: 'Sub-Categorias',
    path: '/dashboard/subcategoria',
    icon: iconPng('categorizacao'),
    permission: ["1", "2"]

  },
  {
    title: 'Transportes',
    path: '/dashboard/transporte',
    icon: iconPng('cargueiro'),
    permission: []

  },

];

export default navConfig;
