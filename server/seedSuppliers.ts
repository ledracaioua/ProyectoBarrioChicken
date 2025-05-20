// server/seedSuppliers.ts
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Supplier from './models/Supplier.js';

dotenv.config();

async function seedSuppliers() {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);

    console.log('Conectado a MongoDB Atlas');

    const suppliers = [
        {
            name: 'MINUTO VERDE',
            rut: '96.557.910-0',
            email: 'admvta@minutoverde.cl',
            insumo: 'PAPAS FRITAS 7MM, EMPANADAS MEDIA LUNA, AROS DE CEBOLLA, PECHUGA DE POLLO DESHUESADA',
            additionalInfo: 'Rotas: LUNES-MARTES, MARTES-MIERCOLES, MIERCOLES-JUEVES, JUEVES-VIERNES, VIERNES-SABADO, VIERNES-LUNES',
        },
        {
            name: 'CAMILO FERRON',
            rut: '96.998.510-1',
            email: 'ventas@ferronchile.cl',
            insumo: 'MANTECA SEMILIQUIDA',
            additionalInfo: 'Rotas: LUNES-MARTES, JUEVES-VIERNES',
        },
        {
            name: 'PF',
            rut: '91.004.000-6',
            email: 'octavio.fuentes@pfalimentos.cl',
            insumo: 'TOCINO',
            additionalInfo: 'Rotas: LUNES-MIERCOLES, MIERCOLES-VIERNES, VIERNES-LUNES',
        },
        {
            name: 'AGROSUPER',
            rut: '76.129.263-3',
            email: 'vnettle@agrosuper.com',
            insumo: 'TRUTRO DESHUESADO, TRUTRO ALA, FILETILLO DE POLLO',
            additionalInfo: 'Carnes e produtos refrigerados. Rotas: LUNES-MIERCOLES, MIERCOLES-VIERNES, VIERNES-LUNES',
        },
        {
            name: 'GIRASOLES',
            rut: '77.799.875-7',
            email: 'pedidos@agrogirasol.cl; pquintana@agrogirasol.cl',
            insumo: 'LECHUGA ESCAROLA, LECHUGA VARIEDAD, CEBOLLA PLUMA, CEBOLLA MORADA, CILANTRO, MIX COLESLAW, AJI VERDE',
            additionalInfo: 'Rotas: LUNES-MARTES, MIERCOLES-JUEVES, VIERNES-SABADO',
        },
        {
            name: 'BAGNO',
            rut: '76.501.664-9',
            email: 'pedidos@bagno.cl',
            insumo: 'TOMATE, PALTA',
            additionalInfo: 'Rotas: LUNES-MARTES, MARTES-MIERCOLES, MIERCOLES-JUEVES, JUEVES-VIERNES, VIERNES-SABADO',
        },
        {
            name: 'ANDINA',
            rut: '96.505.000-7',
            email: 'contactcenter5@koandina.com',
            insumo: 'BIB COCA, BIB COCA ZERO, BIB ANDIFRUT, BIB FANTA ZERO, BIB SPRITE ZERO, COCA 350 CC, COCA ZERO 350 CC, FANTA 350 CC, SPRITE 350 CC, COCA 1.5 LTS, COCA ZERO 1.5 LTS, FANTA ZERO 1.5 LTS, SPRITE 1.5 LTS, BENEDICTINO S/G, BENEDICTINO C/G',
            additionalInfo: 'Rotas: LUNES-MIERCOLES, MIERCOLES-SABADO',
        },
        {
            name: 'IDEAL',
            rut: '99.533.840-8',
            email: 'olaolacl.centraldepedidos@grupobimbo.com',
            insumo: 'PAN BRIOCHE',
            additionalInfo: 'Rotas: LUNES-JUEVES, MIERCOLES-SABADO, VIERNES-MARTES',
        },
        {
            name: 'ICB',
            rut: '77.965.620-9',
            email: 'emontilla@icbfs.cl',
            insumo: 'QUESO CHEDDAR, QUESO MOZZARELLA',
            additionalInfo: 'Rotas: LUNES-MARTES, MARTES-MIERCOLES, MIERCOLES-JUEVES, JUEVES-VIERNES',
        },
        {
            name: 'SOPROLE',
            rut: '76.101.812-4',
            email: '',
            insumo: 'CREMA DE LECHE, LECHE ENTERA, YOGURT',
            additionalInfo: 'Rotas: MIERCOLES-SABADO, VIERNES-MARTES',
        },
        {
            name: 'AROMO',
            rut: '',
            email: '',
            insumo: 'VINO BLANCO',
            additionalInfo: 'Rotas: LUNES-MARTES, JUEVES-VIERNES',
        },
        {
            name: 'FOOD EXPERT',
            rut: '',
            email: '',
            insumo: 'PEPINILLOS DILL LAMINADO',
            additionalInfo: 'Rotas: MIERCOLES-SABADO, VIERNES-MARTES',
        },
        {
            name: 'HUNGRY BROS',
            rut: '',
            email: '',
            insumo: 'SMOKEY BBQ SAUCE',
            additionalInfo: 'Rotas: LUNES-MARTES, MARTES-MIERCOLES',
        },
        {
            name: 'GOURMET',
            rut: '',
            email: '',
            insumo: 'HUMO LIQUIDO, SALSA DE SOYA, SALSA INGLESA',
            additionalInfo: 'Rotas: LUNES-MARTES, JUEVES-VIERNES',
        },
        {
            name: 'HELA',
            rut: '',
            email: '',
            insumo: 'CONDIMENTO CAJUN, APANADO CROCANTE, HARINA 25 KG, EMPANIZADOR',
            additionalInfo: 'Rotas: MIERCOLES-SABADO, VIERNES-MARTES',
        },
        {
            name: 'DULCONO ROMA',
            rut: '',
            email: '',
            insumo: 'CONO – SUPER, CONO ARTESANAL',
            additionalInfo: 'Rotas: LUNES-MARTES, MARTES-MIERCOLES',
        },
        {
            name: 'HELLMANNS',
            rut: '',
            email: '',
            insumo: 'MAYONESA, KETCHUP, BBQ',
            additionalInfo: 'Rotas: LUNES-MARTES, MARTES-MIERCOLES, MIERCOLES-JUEVES, JUEVES-VIERNES',
        },
        {
            name: 'JB',
            rut: '',
            email: '',
            insumo: 'MOSTAZA, AJI',
            additionalInfo: 'Rotas: LUNES-MARTES, MARTES-MIERCOLES, MIERCOLES-JUEVES, JUEVES-VIERNES',
        },
        {
            name: 'TRAVERSO',
            rut: '',
            email: '',
            insumo: 'VINAGRE DE VINO ROSADO',
            additionalInfo: 'Rotas: MIERCOLES-SABADO, VIERNES-MARTES',
        },
        {
            name: 'PANCHO VILLA',
            rut: '',
            email: '',
            insumo: 'TORTILLAS MEXICANAS GIGANTES',
            additionalInfo: 'Rotas: LUNES-MARTES, MARTES-MIERCOLES',
        },
    ];


    await Supplier.insertMany(suppliers);
    console.log('Proveedores adicionados con sucesso!');
  } catch (error) {
    console.error('Error al adicionar proveedores:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedSuppliers();
