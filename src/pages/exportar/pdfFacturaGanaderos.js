import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

import moment from "moment";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  section: {
    margin: 10,
    padding: 10,
    textAlign: "center",
    display: "flex",
  },
  section_desglose: {
    margin: 10,
    padding: 10,
    textAlign: "left",
    display: "flex",
    marginLeft: "30%",
  },
  section_img: {
    margin: "0 auto",
    marginTop: "20px",
  },
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
  img: {
    width: 100,
  },
  neto: {
    fontSize: 25,
    textDecoration: "underline",
  },
});

function PdfFacturaGanaderos({ d, desde, hasta, dateList }) {
  const today = moment().format("DD-MM-YYYY");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section_img}>
          <Image
            style={styles.img}
            src={process.env.PUBLIC_URL + "/logo_pipo.png"}
          />
        </View>
        <View style={styles.section}>
          <Text>Alimentos Pippo</Text>
          <Text>Fecha: {today} </Text>
          <Text>Ruta: {d?.ruta}</Text>
          <Text>Ganadero: {d?.ganadero}</Text>
          <Text>Precio x litro: ${d?.precio}</Text>
          <Text> </Text>
          <Text>Facturado: {`Desde ${desde} - hasta ${hasta}`}</Text>
        </View>
        <View style={styles.section_desglose}>
          <Text>Desglose:</Text>
          {dateList?.map((date, index) => (
            <Text>
              Fecha: {date} - Litros:{d[date.replaceAll("-", "")] || 0}
            </Text>

            /*  <Text>Fecha: {date} Litros:</Text> */
          ))}
        </View>
        <View style={styles.section}>
          <Text>Total litros: {d?.litros_total}</Text>
          <Text style={styles.neto}>Neto pagar: ${d?.neto_pagar}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default PdfFacturaGanaderos;
