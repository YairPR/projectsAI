const CONFIG = {
  SPREADSHEET_ID: '1lxzMbp--k1eGaZUPyJVa-WsQlatQ9uXYihWiqWCL14w',
  DRIVE_FOLDER_ID: '1ILl8cTxdqb18lTcS4LCzkXl8tmTqTT2x',
  LOGO_FILE_ID: '1x1QF4bue8MVpBcS__Jp9i3nd2a7pEY_N',
  TIME_ZONE: 'America/Lima',
  CURRENCY: 'S/',
  CLIENT_PREFIX: 'CLI',
  RESERVATION_PREFIX: 'RES',
  RECEIPT_PREFIX: 'CP'
};

const SETTINGS_DEFAULTS = {
  titulo_app: 'Yacotari',
  nombre_modulo: 'Alquiler de Eventos',
  nombre_negocio: 'Recreo Yacotari',
  nombre_arrendatario: 'Conni Fiorela Torres Vasquez',
  telefono_arrendatario: '933349434',
  telefono_negocio: '933349434',
  moneda: 'S/',
  recurso_principal: 'Recreo Yacotari',
  adelanto_minimo_porcentaje: '50',
  politica_cancelacion: 'Toda reserva separa fecha con adelanto. Toda anulacion se registra con trazabilidad y se revisa segun la politica comercial aceptada por el cliente.',
  porcentaje_reembolso_cancelacion: '80',
  secuencia_cliente: '0',
  secuencia_reserva: '0',
  secuencia_comprobante: '0'
};

const SHEETS = {
  RESERVATIONS: 'Reservas',
  RECEIPTS: 'Comprobantes',
  PAYMENTS: 'Pagos',
  CLIENTS: 'Clientes',
  SETTINGS: 'Configuracion'
};

const SHEET_ALIASES = {
  Reservas: ['RESERVAS'],
  Comprobantes: ['COMPROBANTES', 'DOCUMENTOS'],
  Pagos: ['PAGOS'],
  Clientes: ['CLIENTES'],
  Configuracion: ['CONFIGURACION']
};

const RESERVATION_HEADERS = [
  'codigo_reserva',
  'fecha_registro',
  'nombre_cliente',
  'numero_documento',
  'telefono_cliente',
  'fecha_evento',
  'etiqueta_horario',
  'hora_inicio',
  'hora_fin',
  'cantidad_personas',
  'tipo_evento',
  'monto_total',
  'monto_adelanto',
  'monto_saldo',
  'metodo_pago',
  'observaciones',
  'estado_reserva',
  'codigo_comprobante',
  'url_pdf',
  'url_whatsapp',
  'nombre_arrendatario',
  'telefono_arrendatario',
  'id_cliente',
  'estado_pago',
  'fecha_cancelacion',
  'motivo_cancelacion',
  'recurso',
  'estado',
  'porcentaje_reembolso',
  'monto_reembolso'
];

const RECEIPT_HEADERS = [
  'codigo_comprobante',
  'codigo_reserva',
  'fecha_emision',
  'nombre_cliente',
  'numero_documento',
  'telefono_cliente',
  'fecha_evento',
  'etiqueta_horario',
  'monto_total',
  'monto_adelanto',
  'monto_saldo',
  'metodo_pago',
  'url_pdf',
  'id_archivo_drive',
  'nombre_arrendatario',
  'telefono_arrendatario',
  'id_cliente',
  'estado_pago',
  'recurso',
  'tipo_comprobante',
  'monto_pagado'
];

const PAYMENT_HEADERS = [
  'codigo_pago',
  'codigo_reserva',
  'fecha_pago',
  'id_cliente',
  'nombre_cliente',
  'numero_documento',
  'metodo_pago',
  'monto_pagado',
  'saldo_resultante',
  'estado_pago_resultante',
  'tipo_pago',
  'observacion',
  'recurso'
];

const CLIENT_HEADERS = [
  'id_cliente',
  'numero_documento',
  'nombre_cliente',
  'telefono',
  'fecha_registro',
  'fecha_actualizacion'
];

const SETTINGS_HEADERS = ['clave_configuracion', 'valor_configuracion'];

const LEGACY_RESERVATION_HEADERS = [
  [
    'codigo_reserva',
    'fecha_registro',
    'nombre_cliente',
    'numero_documento',
    'telefono_cliente',
    'fecha_evento',
    'etiqueta_horario',
    'hora_inicio',
    'hora_fin',
    'cantidad_personas',
    'tipo_evento',
    'monto_total',
    'monto_adelanto',
    'monto_saldo',
    'metodo_pago',
    'observaciones',
    'estado_reserva',
    'codigo_comprobante',
    'url_pdf',
    'url_whatsapp',
    'nombre_arrendatario',
    'telefono_arrendatario',
    'id_cliente'
  ],
  [
    'reservation_code',
    'created_at',
    'customer_name',
    'document_number',
    'customer_phone',
    'event_date',
    'schedule_label',
    'start_time',
    'end_time',
    'guest_count',
    'event_type',
    'total_amount',
    'deposit_amount',
    'balance_amount',
    'payment_method',
    'notes',
    'status',
    'receipt_code',
    'pdf_url',
    'whatsapp_url',
    'lessor_name_snapshot',
    'lessor_phone_snapshot'
  ],
  [
    'correlativo',
    'fecha_registro',
    'nombre',
    'documento',
    'telefono',
    'fecha_evento',
    'horario',
    'personas',
    'tipo_evento',
    'monto_total',
    'adelanto',
    'saldo',
    'metodo_pago',
    'observaciones',
    'estado',
    'pdf_url',
    'whatsapp_url'
  ]
];

const LEGACY_RECEIPT_HEADERS = [
  [
    'codigo_comprobante',
    'codigo_reserva',
    'fecha_emision',
    'nombre_cliente',
    'numero_documento',
    'telefono_cliente',
    'fecha_evento',
    'etiqueta_horario',
    'monto_total',
    'monto_adelanto',
    'monto_saldo',
    'metodo_pago',
    'url_pdf',
    'id_archivo_drive',
    'nombre_arrendatario',
    'telefono_arrendatario'
  ],
  [
    'receipt_code',
    'reservation_code',
    'issued_at',
    'customer_name',
    'document_number',
    'customer_phone',
    'event_date',
    'schedule_label',
    'total_amount',
    'deposit_amount',
    'balance_amount',
    'payment_method',
    'pdf_url',
    'drive_file_id',
    'lessor_name_snapshot',
    'lessor_phone_snapshot'
  ],
  [
    'comprobante',
    'correlativo_reserva',
    'fecha_emision',
    'nombre',
    'documento',
    'telefono',
    'monto_total',
    'adelanto',
    'saldo',
    'metodo_pago',
    'pdf_url',
    'drive_file_id'
  ]
];

const LEGACY_PAYMENT_HEADERS = [];

const LEGACY_CLIENT_HEADERS = [
  [
    'clave_cliente',
    'numero_documento',
    'nombre_completo',
    'telefono_e164',
    'telefono_original',
    'ultimo_codigo_reserva',
    'fecha_actualizacion'
  ],
  [
    'client_key',
    'document_number',
    'full_name',
    'phone_e164',
    'phone_raw',
    'last_reservation_code',
    'updated_at'
  ],
  [
    'id_cliente',
    'numero_documento',
    'nombre_cliente',
    'telefono',
    'fecha_registro',
    'fecha_actualizacion'
  ],
  [
    'documento',
    'nombre',
    'telefono',
    'fecha_actualizacion'
  ]
];

const LEGACY_SETTINGS_HEADERS = [
  ['config_key', 'config_value'],
  ['clave', 'valor']
];

const RES_COL = makeIndexMap_(RESERVATION_HEADERS);
const RECEIPT_COL = makeIndexMap_(RECEIPT_HEADERS);
const CLIENT_COL = makeIndexMap_(CLIENT_HEADERS);
const PAYMENT_COL = makeIndexMap_(PAYMENT_HEADERS);

function doGet() {
  const runtimeConfig = getRuntimeConfig_();
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(runtimeConfig.tituloApp)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setup() {
  const ss = getSpreadsheet_();
  ensureProjectSheets_(ss);
  seedSettings_(ss);
  backfillReservationClientIds_(ss);
  return 'Setup completado';
}

function getInitialData() {
  const runtimeConfig = getRuntimeConfig_();
  return {
    appTitle: runtimeConfig.tituloApp,
    moduleName: runtimeConfig.nombreModulo,
    venueName: runtimeConfig.nombreNegocio,
    lessorName: runtimeConfig.nombreArrendatario,
    businessPhone: runtimeConfig.telefonoNegocio,
    lessorPhone: runtimeConfig.telefonoArrendatario,
    logoDataUrl: getLogoDataUrl_(),
    logoPublicUrl: getLogoPublicUrl_(),
    currency: runtimeConfig.moneda,
    today: Utilities.formatDate(new Date(), CONFIG.TIME_ZONE, 'yyyy-MM-dd'),
    depositPercent: runtimeConfig.adelantoMinimoPorcentaje,
    cancellationRefundPercent: runtimeConfig.porcentajeReembolsoCancelacion,
    scheduleOptions: getScheduleOptions_()
  };
}

function saveReservation(form) {
  validateReservation_(form);

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = getSpreadsheet_();
    assertProjectReady_(ss);
    const runtimeConfig = getRuntimeConfig_();
    const horario = buildSchedule_(form.schedule_slot);
    const totals = calculateTotals_(form);

    assertMinimumDeposit_(totals, runtimeConfig);
    assertReservationAvailability_(ss, clean_(form.fechaEvento), horario.startTime, horario.endTime, '', runtimeConfig.recursoPrincipal);

    const clientData = upsertClient_(ss, {
      numeroDocumento: clean_(form.documento),
      nombreCliente: normalizeCustomerName_(form.nombre),
      telefonoCliente: normalizePhone_(form.telefono)
    });

    const record = {
      codigoReserva: nextSequence_(ss, 'secuencia_reserva', CONFIG.RESERVATION_PREFIX),
      fechaRegistro: new Date(),
      nombreCliente: normalizeCustomerName_(form.nombre),
      numeroDocumento: clean_(form.documento),
      telefonoCliente: normalizePhone_(form.telefono),
      fechaEvento: clean_(form.fechaEvento),
      etiquetaHorario: horario.label,
      horaInicio: horario.startTime,
      horaFin: horario.endTime,
      cantidadPersonas: Number(form.personas || 0),
      tipoEvento: clean_(form.tipoEvento),
      montoTotal: totals.montoTotal,
      montoAdelanto: totals.adelanto,
      montoSaldo: totals.saldo,
      metodoPago: clean_(form.metodoPago),
      observaciones: clean_(form.observaciones),
      estadoReserva: totals.saldo <= 0 ? 'completada' : 'reservada',
      estado: deriveOperationalStatus_(totals.saldo <= 0 ? 'completada' : 'reservada', totals),
      codigoComprobante: '',
      urlPdf: '',
      urlWhatsapp: '',
      nombreArrendatario: runtimeConfig.nombreArrendatario,
      telefonoArrendatario: runtimeConfig.telefonoArrendatario,
      idCliente: clientData.idCliente,
      estadoPago: computePaymentStatus_(totals),
      fechaCancelacion: '',
      motivoCancelacion: '',
      porcentajeReembolso: '',
      montoReembolso: '',
      recurso: runtimeConfig.recursoPrincipal
    };

    appendReservation_(ss, record);
    savePaymentMovement_(ss, {
      codigoReserva: record.codigoReserva,
      idCliente: record.idCliente,
      nombreCliente: record.nombreCliente,
      numeroDocumento: record.numeroDocumento,
      metodoPago: record.metodoPago,
      montoPagado: record.montoAdelanto,
      saldoResultante: record.montoSaldo,
      estadoPagoResultante: record.estadoPago,
      tipoPago: record.montoSaldo <= 0 ? 'pago_total_inicial' : 'adelanto_inicial',
      observacion: record.montoSaldo <= 0 ? 'Reserva creada pagada al 100%' : 'Registro inicial de reserva',
      recurso: record.recurso
    });

    return {
      ok: true,
      reservationCode: record.codigoReserva,
      reservationStatus: record.estadoReserva,
      operationalStatus: record.estado,
      paymentStatus: record.estadoPago,
      message: 'Reserva ' + record.codigoReserva + ' guardada correctamente.'
    };
  } finally {
    lock.releaseLock();
  }
}

function updateReservation(form) {
  validateReservation_(form);

  const codigoReserva = clean_(form.reservationCode);
  if (!codigoReserva) {
    throw new Error('No se indico la reserva a actualizar.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = getSpreadsheet_();
    assertProjectReady_(ss);
    const runtimeConfig = getRuntimeConfig_();
    const match = findReservationByCode_(ss, codigoReserva);

    if (!match) {
      throw new Error('No se encontro la reserva ' + codigoReserva + '.');
    }

    const currentRecord = buildReservationRecordFromRow_(match.row);
    if (currentRecord.estadoReserva === 'cancelada') {
      throw new Error('No puedes editar una reserva cancelada.');
    }

    const horario = buildSchedule_(form.schedule_slot);
    const totals = calculateTotals_(form);

    assertMinimumDeposit_(totals, runtimeConfig);
    assertReservationAvailability_(ss, clean_(form.fechaEvento), horario.startTime, horario.endTime, codigoReserva, runtimeConfig.recursoPrincipal);

    const clientData = upsertClient_(ss, {
      numeroDocumento: clean_(form.documento),
      nombreCliente: normalizeCustomerName_(form.nombre),
      telefonoCliente: normalizePhone_(form.telefono)
    });

    const updatedRecord = {
      codigoReserva: currentRecord.codigoReserva,
      fechaRegistro: currentRecord.fechaRegistro,
      nombreCliente: normalizeCustomerName_(form.nombre),
      numeroDocumento: clean_(form.documento),
      telefonoCliente: normalizePhone_(form.telefono),
      fechaEvento: clean_(form.fechaEvento),
      etiquetaHorario: horario.label,
      horaInicio: horario.startTime,
      horaFin: horario.endTime,
      cantidadPersonas: Number(form.personas || 0),
      tipoEvento: clean_(form.tipoEvento),
      montoTotal: totals.montoTotal,
      montoAdelanto: totals.adelanto,
      montoSaldo: totals.saldo,
      metodoPago: clean_(form.metodoPago),
      observaciones: clean_(form.observaciones),
      estadoReserva: totals.saldo <= 0 ? 'completada' : 'reservada',
      estado: deriveOperationalStatus_(totals.saldo <= 0 ? 'completada' : 'reservada', totals),
      codigoComprobante: currentRecord.codigoComprobante || '',
      urlPdf: currentRecord.urlPdf || '',
      urlWhatsapp: currentRecord.urlWhatsapp || '',
      nombreArrendatario: currentRecord.nombreArrendatario || runtimeConfig.nombreArrendatario,
      telefonoArrendatario: currentRecord.telefonoArrendatario || runtimeConfig.telefonoArrendatario,
      idCliente: clientData.idCliente,
      estadoPago: computePaymentStatus_(totals),
      fechaCancelacion: currentRecord.fechaCancelacion || '',
      motivoCancelacion: currentRecord.motivoCancelacion || '',
      porcentajeReembolso: currentRecord.porcentajeReembolso || '',
      montoReembolso: currentRecord.montoReembolso || '',
      recurso: currentRecord.recurso || runtimeConfig.recursoPrincipal
    };

    updateReservationRecord_(match.sheet, match.rowIndex, updatedRecord);

    const paymentDelta = Number((safeNumber_(updatedRecord.montoAdelanto) - safeNumber_(currentRecord.montoAdelanto)).toFixed(2));
    if (paymentDelta !== 0) {
      savePaymentMovement_(ss, {
        codigoReserva: updatedRecord.codigoReserva,
        idCliente: updatedRecord.idCliente,
        nombreCliente: updatedRecord.nombreCliente,
        numeroDocumento: updatedRecord.numeroDocumento,
        metodoPago: updatedRecord.metodoPago,
        montoPagado: paymentDelta,
        saldoResultante: updatedRecord.montoSaldo,
        estadoPagoResultante: updatedRecord.estadoPago,
        tipoPago: 'ajuste_edicion_reserva',
        observacion: paymentDelta > 0 ? 'Ajuste por edicion de reserva: aumento de adelanto' : 'Ajuste por edicion de reserva: reduccion de adelanto',
        recurso: updatedRecord.recurso
      });
    }

    return {
      ok: true,
      reservationCode: updatedRecord.codigoReserva,
      reservationStatus: updatedRecord.estadoReserva,
      operationalStatus: updatedRecord.estado,
      paymentStatus: updatedRecord.estadoPago,
      message: 'Reserva ' + updatedRecord.codigoReserva + ' actualizada correctamente.'
    };
  } finally {
    lock.releaseLock();
  }
}

function generateReceipt(reservationCode) {
  const codigoReserva = clean_(reservationCode);
  if (!codigoReserva) {
    throw new Error('Primero guarda la reserva antes de generar el comprobante.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = getSpreadsheet_();
    assertProjectReady_(ss);
    const runtimeConfig = getRuntimeConfig_();
    const match = findReservationByCode_(ss, codigoReserva);

    if (!match) {
      throw new Error('No se encontro la reserva ' + codigoReserva + '.');
    }

    const record = buildReservationRecordFromRow_(match.row);
    const receipts = findReceiptsByReservationCode_(ss, record.codigoReserva);
    const advanceReceipt = receipts.find(function(item) { return item.tipoComprobante === 'adelanto'; });
    const finalReceipt = receipts.find(function(item) { return item.tipoComprobante === 'pago_completado'; });

    if (record.estadoReserva === 'cancelada') {
      throw new Error('No puedes generar comprobante para una reserva cancelada.');
    }

    if (record.montoSaldo > 0 && advanceReceipt) {
      return {
        ok: true,
        reservationCode: record.codigoReserva,
        receiptCode: advanceReceipt.receiptCode,
        pdfUrl: advanceReceipt.pdfUrl,
        whatsappUrl: record.urlWhatsapp,
        downloadUrl: buildDriveDownloadUrl_(advanceReceipt.fileId),
        reservationStatus: record.estadoReserva,
        operationalStatus: record.estado,
        paymentStatus: record.estadoPago,
        message: 'La reserva ya tiene su comprobante de adelanto.'
      };
    }

    if (record.montoSaldo <= 0 && finalReceipt) {
      return {
        ok: true,
        reservationCode: record.codigoReserva,
        receiptCode: finalReceipt.receiptCode,
        pdfUrl: finalReceipt.pdfUrl,
        whatsappUrl: record.urlWhatsapp,
        downloadUrl: buildDriveDownloadUrl_(finalReceipt.fileId),
        reservationStatus: record.estadoReserva,
        operationalStatus: record.estado,
        paymentStatus: record.estadoPago,
        message: 'La reserva ya tiene su comprobante final.'
      };
    }

    record.codigoComprobante = nextSequence_(ss, 'secuencia_comprobante', CONFIG.RECEIPT_PREFIX);
    record.nombreArrendatario = record.nombreArrendatario || runtimeConfig.nombreArrendatario;
    record.telefonoArrendatario = record.telefonoArrendatario || runtimeConfig.telefonoArrendatario;
    record.recurso = record.recurso || runtimeConfig.recursoPrincipal;
    record.tipoComprobante = buildReceiptType_(record, advanceReceipt);
    record.montoPagadoComprobante = record.tipoComprobante === 'pago_completado'
      ? safeNumber_(record.montoTotal)
      : safeNumber_(record.montoAdelanto);

    const pdf = createReceiptPdf_(record, runtimeConfig);
    const whatsappUrl = buildWhatsAppUrl_(record, pdf.url, runtimeConfig);

    appendReceipt_(ss, record, pdf);
    updateReservationReceipt_(match.sheet, match.rowIndex, record.codigoComprobante, pdf.url, whatsappUrl);

    return {
      ok: true,
      reservationCode: record.codigoReserva,
      receiptCode: record.codigoComprobante,
      pdfUrl: pdf.url,
      whatsappUrl: whatsappUrl,
      downloadUrl: buildDriveDownloadUrl_(pdf.id),
      reservationStatus: 'comprobante_generado',
      operationalStatus: deriveOperationalStatus_('comprobante_generado', record),
      paymentStatus: record.estadoPago,
      message: 'Comprobante ' + record.codigoComprobante + ' generado correctamente.'
    };
  } finally {
    lock.releaseLock();
  }
}

function cancelReservation(reservationCode, cancelReason) {
  const codigoReserva = clean_(reservationCode);
  const motivo = clean_(cancelReason) || 'Cancelacion operativa registrada';

  if (!codigoReserva) {
    throw new Error('No hay una reserva activa para cancelar.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = getSpreadsheet_();
    assertProjectReady_(ss);
    const runtimeConfig = getRuntimeConfig_();
    const match = findReservationByCode_(ss, codigoReserva);

    if (!match) {
      throw new Error('No se encontro la reserva ' + codigoReserva + '.');
    }

    const record = buildReservationRecordFromRow_(match.row);
    if (record.estadoReserva === 'cancelada') {
      return {
        ok: true,
        reservationCode: codigoReserva,
        reservationStatus: 'cancelada',
        operationalStatus: 'cancelado',
        paymentStatus: record.estadoPago,
        message: 'La reserva ya estaba cancelada.'
      };
    }

    if (isReservationClosedForCancellation_(record)) {
      throw new Error('La reserva ya se considera cerrada por fecha y no puede cancelarse.');
    }

    const refundInfo = computeCancellationRefund_(record, runtimeConfig);
    let refundPdf = null;
    let refundReceiptCode = '';

    if (refundInfo.refundAmount > 0) {
      refundReceiptCode = nextSequence_(ss, 'secuencia_comprobante', CONFIG.RECEIPT_PREFIX);
      const refundRecord = buildRefundReceiptRecord_(record, refundInfo, motivo, refundReceiptCode);
      refundPdf = createReceiptPdf_(refundRecord, runtimeConfig);
      appendReceipt_(ss, refundRecord, refundPdf);
    }

    match.sheet.getRange(match.rowIndex, RES_COL.estado_reserva).setValue('cancelada');
    match.sheet.getRange(match.rowIndex, RES_COL.estado).setValue('cancelado');
    match.sheet.getRange(match.rowIndex, RES_COL.fecha_cancelacion).setValue(new Date());
    match.sheet.getRange(match.rowIndex, RES_COL.motivo_cancelacion).setValue(motivo);
    match.sheet.getRange(match.rowIndex, RES_COL.porcentaje_reembolso).setValue(refundInfo.refundPercent);
    match.sheet.getRange(match.rowIndex, RES_COL.monto_reembolso).setValue(refundInfo.refundAmount);
    if (refundPdf) {
      match.sheet.getRange(match.rowIndex, RES_COL.codigo_comprobante).setValue(refundReceiptCode);
      match.sheet.getRange(match.rowIndex, RES_COL.url_pdf).setValue(refundPdf.url);
    }

    if (refundInfo.refundAmount > 0) {
      savePaymentMovement_(ss, {
        codigoReserva: record.codigoReserva,
        idCliente: record.idCliente,
        nombreCliente: record.nombreCliente,
        numeroDocumento: record.numeroDocumento,
        metodoPago: 'Devolucion',
        montoPagado: -refundInfo.refundAmount,
        saldoResultante: record.montoSaldo,
        estadoPagoResultante: record.estadoPago,
        tipoPago: 'reembolso_cancelacion',
        observacion: 'Reembolso por cancelacion (' + refundInfo.refundPercent + '%). ' + motivo,
        recurso: record.recurso || runtimeConfig.recursoPrincipal
      });
    }

    return {
      ok: true,
      reservationCode: codigoReserva,
      reservationStatus: 'cancelada',
      operationalStatus: 'cancelado',
      paymentStatus: record.estadoPago,
      refundPercent: refundInfo.refundPercent,
      refundAmount: refundInfo.refundAmount,
      paidAmount: refundInfo.paidAmount,
      refundReceiptCode: refundReceiptCode,
      refundPdfUrl: refundPdf ? refundPdf.url : '',
      refundDownloadUrl: refundPdf ? buildDriveDownloadUrl_(refundPdf.id) : '',
      message: 'Reserva ' + codigoReserva + ' cancelada correctamente.'
    };
  } finally {
    lock.releaseLock();
  }
}

function registerFinalPayment(reservationCode, paymentMethod) {
  return registerPayment(reservationCode, paymentMethod, '');
}

function registerPayment(reservationCode, paymentMethod, paymentAmount) {
  const codigoReserva = clean_(reservationCode);
  const metodoFinal = clean_(paymentMethod);
  const amountInput = Number(paymentAmount || 0);

  if (!codigoReserva) {
    throw new Error('Selecciona una reserva valida.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = getSpreadsheet_();
    assertProjectReady_(ss);
    const runtimeConfig = getRuntimeConfig_();
    const match = findReservationByCode_(ss, codigoReserva);

    if (!match) {
      throw new Error('No se encontro la reserva ' + codigoReserva + '.');
    }

    const record = buildReservationRecordFromRow_(match.row);

    if (record.estadoReserva === 'cancelada') {
      throw new Error('No puedes completar el pago de una reserva cancelada.');
    }

    if (safeNumber_(record.montoSaldo) <= 0) {
      return {
        ok: true,
        reservationCode: record.codigoReserva,
        reservationStatus: 'completada',
        operationalStatus: 'completado',
        paymentStatus: 'pagado_total',
        receiptCode: record.codigoComprobante || '',
        pdfUrl: record.urlPdf || '',
        message: 'La reserva ya estaba completada al 100%.'
      };
    }

    const montoPendiente = safeNumber_(record.montoSaldo);
    const montoPago = amountInput > 0 ? amountInput : montoPendiente;
    if (montoPago <= 0) {
      throw new Error('Ingresa un monto de pago valido.');
    }

    if (montoPago > montoPendiente) {
      throw new Error('El monto no puede ser mayor al saldo pendiente.');
    }

    record.metodoPago = metodoFinal || record.metodoPago || 'Efectivo';
    record.montoAdelanto = safeNumber_(record.montoAdelanto) + montoPago;
    record.montoSaldo = Number((montoPendiente - montoPago).toFixed(2));
    record.estadoPago = computePaymentStatus_(record);
    record.estadoReserva = record.montoSaldo <= 0 ? 'completada' : 'reservada';
    record.estado = deriveOperationalStatus_(record.estadoReserva, record);
    record.nombreArrendatario = record.nombreArrendatario || runtimeConfig.nombreArrendatario;
    record.telefonoArrendatario = record.telefonoArrendatario || runtimeConfig.telefonoArrendatario;
    record.recurso = record.recurso || runtimeConfig.recursoPrincipal;
    const whatsappUrl = record.urlWhatsapp || '';

    updateReservationPayment_(match.sheet, match.rowIndex, record);
    savePaymentMovement_(ss, {
      codigoReserva: record.codigoReserva,
      idCliente: record.idCliente,
      nombreCliente: record.nombreCliente,
      numeroDocumento: record.numeroDocumento,
      metodoPago: record.metodoPago,
      montoPagado: montoPago,
      saldoResultante: record.montoSaldo,
      estadoPagoResultante: record.estadoPago,
      tipoPago: record.montoSaldo <= 0 ? 'pago_final' : 'pago_parcial',
      observacion: record.montoSaldo <= 0 ? 'Reserva completada al 100%' : 'Pago parcial adicional',
      recurso: record.recurso
    });

    return {
      ok: true,
      reservationCode: record.codigoReserva,
      reservationStatus: record.estadoReserva,
      operationalStatus: record.estado,
      paymentStatus: record.estadoPago,
      receiptCode: record.codigoComprobante,
      pdfUrl: record.urlPdf,
      whatsappUrl: whatsappUrl,
      amountPaid: montoPago,
      remainingBalance: record.montoSaldo,
      message: record.montoSaldo <= 0
        ? 'Pago registrado y reserva completada.'
        : 'Pago registrado. La reserva sigue pendiente por saldo.'
    };
  } finally {
    lock.releaseLock();
  }
}

function listReservations(limit) {
  const ss = getSpreadsheet_();
  assertProjectReady_(ss);
  const sheet = getSheetRequired_(ss, SHEETS.RESERVATIONS);
  const rows = getSheetRecords_(sheet, RESERVATION_HEADERS, LEGACY_RESERVATION_HEADERS)
    .map(buildReservationRecordFromRow_)
    .reverse();

  return rows.slice(0, Number(limit || 10)).map(function(record) {
    return {
      correlativo: record.codigoReserva,
      idCliente: record.idCliente,
      fechaRegistro: formatSheetDateTime_(record.fechaRegistro),
      nombre: record.nombreCliente,
      documento: record.numeroDocumento,
      telefono: record.telefonoCliente,
      fechaEvento: formatSheetDate_(record.fechaEvento),
      horario: record.etiquetaHorario,
      tipoEvento: record.tipoEvento,
      montoTotal: safeNumber_(record.montoTotal),
      adelanto: safeNumber_(record.montoAdelanto),
      saldo: safeNumber_(record.montoSaldo),
      metodoPago: record.metodoPago,
      estadoReserva: record.estadoReserva || 'reservada',
      estado: record.estado || deriveOperationalStatus_(record.estadoReserva, record),
      estadoPago: record.estadoPago || computePaymentStatus_(record),
      comprobante: record.codigoComprobante,
      pdfUrl: record.urlPdf,
      whatsappUrl: record.urlWhatsapp,
      motivoCancelacion: record.motivoCancelacion,
      fechaCancelacion: formatSheetDateTime_(record.fechaCancelacion),
      porcentajeReembolso: safeNumber_(record.porcentajeReembolso),
      montoReembolso: safeNumber_(record.montoReembolso),
      recurso: record.recurso,
      canCompletePayment: (record.estadoReserva !== 'cancelada') && safeNumber_(record.montoSaldo) > 0
    };
  });
}

function getReservationDetails(reservationCode) {
  const codigoReserva = clean_(reservationCode);
  if (!codigoReserva) {
    throw new Error('Selecciona una reserva valida.');
  }

  const ss = getSpreadsheet_();
  assertProjectReady_(ss);
  const match = findReservationByCode_(ss, codigoReserva);

  if (!match) {
    throw new Error('No se encontro la reserva ' + codigoReserva + '.');
  }

  const record = buildReservationRecordFromRow_(match.row);
  const receipts = findReceiptsByReservationCode_(ss, codigoReserva);
  const advanceReceipt = receipts.find(function(item) { return item.tipoComprobante === 'adelanto'; });
  const finalReceipt = receipts.find(function(item) { return item.tipoComprobante === 'pago_completado'; });
  const refundReceipt = receipts.find(function(item) { return item.tipoComprobante === 'reembolso'; });
  const currentReceipt = refundReceipt || finalReceipt || advanceReceipt || null;

  return {
    reservationCode: record.codigoReserva,
    customerName: record.nombreCliente,
    documentNumber: record.numeroDocumento,
    customerPhone: record.telefonoCliente,
    eventDate: formatSheetDate_(record.fechaEvento),
    eventDateRaw: normalizeDateKey_(record.fechaEvento),
    scheduleLabel: record.etiquetaHorario,
    scheduleValue: [record.horaInicio || '', record.horaFin || '', record.etiquetaHorario || ''].join('|'),
    guestCount: Number(record.cantidadPersonas || 0),
    eventType: record.tipoEvento,
    totalAmount: safeNumber_(record.montoTotal),
    depositAmount: safeNumber_(record.montoAdelanto),
    balanceAmount: safeNumber_(record.montoSaldo),
    statusLabel: toTitleCase_(record.estado || deriveOperationalStatus_(record.estadoReserva, record)),
    paymentLabel: buildPaymentLabel_(record.estadoPago),
    receiptCode: record.codigoComprobante || '',
    receiptPdfUrl: record.urlPdf || '',
    receiptFileId: currentReceipt ? currentReceipt.fileId : '',
    receiptDownloadUrl: currentReceipt ? buildDriveDownloadUrl_(currentReceipt.fileId) : '',
    receiptAdvanceCode: advanceReceipt ? advanceReceipt.receiptCode : '',
    receiptAdvancePdfUrl: advanceReceipt ? advanceReceipt.pdfUrl : '',
    receiptAdvanceFileId: advanceReceipt ? advanceReceipt.fileId : '',
    receiptAdvanceDownloadUrl: advanceReceipt ? buildDriveDownloadUrl_(advanceReceipt.fileId) : '',
    receiptFinalCode: finalReceipt ? finalReceipt.receiptCode : '',
    receiptFinalPdfUrl: finalReceipt ? finalReceipt.pdfUrl : '',
    receiptFinalFileId: finalReceipt ? finalReceipt.fileId : '',
    receiptFinalDownloadUrl: finalReceipt ? buildDriveDownloadUrl_(finalReceipt.fileId) : '',
    receiptRefundCode: refundReceipt ? refundReceipt.receiptCode : '',
    receiptRefundPdfUrl: refundReceipt ? refundReceipt.pdfUrl : '',
    receiptRefundFileId: refundReceipt ? refundReceipt.fileId : '',
    receiptRefundDownloadUrl: refundReceipt ? buildDriveDownloadUrl_(refundReceipt.fileId) : '',
    canGenerateReceipt: canGenerateReceiptForRecord_(record, receipts),
    canRegisterPayment: safeNumber_(record.montoSaldo) > 0 && record.estadoReserva !== 'cancelada',
    canCancel: record.estadoReserva !== 'cancelada' && !isReservationClosedForCancellation_(record),
    estadoReserva: record.estadoReserva,
    estadoPago: record.estadoPago,
    metodoPago: record.metodoPago || 'Efectivo',
    observaciones: record.observaciones || '',
    motivoCancelacion: record.motivoCancelacion || '',
    refundAmount: safeNumber_(record.montoReembolso),
    refundPercent: safeNumber_(record.porcentajeReembolso)
  };
}

function listDocuments(limit) {
  const ss = getSpreadsheet_();
  assertProjectReady_(ss);
  const sheet = getSheetRequired_(ss, SHEETS.RECEIPTS);
  const rows = getSheetRecords_(sheet, RECEIPT_HEADERS, LEGACY_RECEIPT_HEADERS).reverse();

  return rows.slice(0, Number(limit || 10)).map(function(row) {
    const fileId = row[RECEIPT_COL.id_archivo_drive - 1];
    return {
      comprobante: row[RECEIPT_COL.codigo_comprobante - 1],
      reserva: row[RECEIPT_COL.codigo_reserva - 1],
      fechaEmision: formatSheetDateTime_(row[RECEIPT_COL.fecha_emision - 1]),
      nombre: row[RECEIPT_COL.nombre_cliente - 1],
      documento: row[RECEIPT_COL.numero_documento - 1],
      montoTotal: safeNumber_(row[RECEIPT_COL.monto_total - 1]),
      adelanto: safeNumber_(row[RECEIPT_COL.monto_adelanto - 1]),
      saldo: safeNumber_(row[RECEIPT_COL.monto_saldo - 1]),
      metodoPago: row[RECEIPT_COL.metodo_pago - 1],
      pdfUrl: row[RECEIPT_COL.url_pdf - 1],
      downloadUrl: buildDriveDownloadUrl_(fileId),
      idCliente: row[RECEIPT_COL.id_cliente - 1] || '',
      estadoPago: row[RECEIPT_COL.estado_pago - 1] || '',
      recurso: row[RECEIPT_COL.recurso - 1] || '',
      tipoComprobante: row[RECEIPT_COL.tipo_comprobante - 1] || '',
      montoPagado: safeNumber_(row[RECEIPT_COL.monto_pagado - 1]),
      fileId: fileId || '',
      tipoComprobanteLabel: buildReceiptTypeLabel_(row[RECEIPT_COL.tipo_comprobante - 1] || '')
    };
  });
}

function createReceiptPdf_(record, runtimeConfig) {
  const template = HtmlService.createTemplateFromFile('pago_total');
  const isRefundReceipt = record.tipoComprobante === 'reembolso';
  const issueDate = new Date();
  template.data = {
    appTitle: runtimeConfig.tituloApp,
    moduleName: runtimeConfig.nombreModulo,
    venueName: runtimeConfig.nombreNegocio,
    reservationCode: record.codigoReserva,
    receiptCode: record.codigoComprobante,
    nombre: record.nombreCliente,
    documento: record.numeroDocumento,
    telefono: record.telefonoCliente,
    fechaEvento: formatSheetDate_(record.fechaEvento),
    horario: record.etiquetaHorario,
    personas: record.cantidadPersonas,
    tipoEvento: record.tipoEvento,
    montoTotal: record.montoTotal,
    adelanto: record.montoAdelanto,
    saldo: record.montoSaldo,
    metodoPago: record.metodoPago,
    observaciones: record.observaciones,
    lessorName: record.nombreArrendatario,
    lessorPhone: record.telefonoArrendatario,
    currency: runtimeConfig.moneda,
    issueDate: Utilities.formatDate(issueDate, CONFIG.TIME_ZONE, 'dd/MM/yyyy HH:mm'),
    paymentStatus: record.estadoPago,
    resourceName: record.recurso,
    receiptTypeLabel: buildReceiptTypeLabel_(record.tipoComprobante),
    receiptKind: record.tipoComprobante || 'adelanto',
    refundedAmount: safeNumber_(record.montoReembolso),
    refundPercent: safeNumber_(record.porcentajeReembolso),
    paidAmount: Number((safeNumber_(record.montoTotal) - safeNumber_(record.montoSaldo)).toFixed(2)),
    cancellationReason: record.motivoCancelacion || '',
    conceptAmount: isRefundReceipt ? safeNumber_(record.montoReembolso) : safeNumber_(record.montoPagadoComprobante || record.montoAdelanto),
    logoSrc: getLogoDataUrl_() || getLogoPublicUrl_()
  };

  const html = template.evaluate().getContent();
  const fileName = buildReceiptFileName_(record);
  const blob = Utilities.newBlob(html, MimeType.HTML, record.codigoComprobante + '.html')
    .getAs(MimeType.PDF)
    .setName(fileName);

  const targetFolder = ensureReceiptFolderPath_(issueDate);
  const file = targetFolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return {
    id: file.getId(),
    url: file.getUrl()
  };
}

function appendReservation_(ss, record) {
  getSheetRequired_(ss, SHEETS.RESERVATIONS).appendRow([
    record.codigoReserva,
    record.fechaRegistro,
    record.nombreCliente,
    record.numeroDocumento,
    record.telefonoCliente,
    record.fechaEvento,
    record.etiquetaHorario,
    record.horaInicio,
    record.horaFin,
    record.cantidadPersonas,
    record.tipoEvento,
    record.montoTotal,
    record.montoAdelanto,
    record.montoSaldo,
    record.metodoPago,
    record.observaciones,
    record.estadoReserva,
    record.codigoComprobante,
    record.urlPdf,
    record.urlWhatsapp,
    record.nombreArrendatario,
    record.telefonoArrendatario,
    record.idCliente,
    record.estadoPago,
    record.fechaCancelacion,
    record.motivoCancelacion,
    record.recurso,
    record.estado,
    record.porcentajeReembolso,
    record.montoReembolso
  ]);
}

function appendReceipt_(ss, record, pdf) {
  getSheetRequired_(ss, SHEETS.RECEIPTS).appendRow([
    record.codigoComprobante,
    record.codigoReserva,
    new Date(),
    record.nombreCliente,
    record.numeroDocumento,
    record.telefonoCliente,
    record.fechaEvento,
    record.etiquetaHorario,
    record.montoTotal,
    record.montoAdelanto,
    record.montoSaldo,
    record.metodoPago,
    pdf.url,
    pdf.id,
    record.nombreArrendatario,
    record.telefonoArrendatario,
    record.idCliente,
    record.estadoPago,
    record.recurso,
    record.tipoComprobante || 'adelanto',
    record.montoPagadoComprobante || record.montoAdelanto
  ]);
}

function updateReservationReceipt_(sheet, rowIndex, codigoComprobante, pdfUrl, whatsappUrl) {
  sheet.getRange(rowIndex, RES_COL.estado_reserva).setValue('comprobante_generado');
  const montoTotal = safeNumber_(sheet.getRange(rowIndex, RES_COL.monto_total).getValue());
  const montoAdelanto = safeNumber_(sheet.getRange(rowIndex, RES_COL.monto_adelanto).getValue());
  const montoSaldo = safeNumber_(sheet.getRange(rowIndex, RES_COL.monto_saldo).getValue());
  sheet.getRange(rowIndex, RES_COL.estado).setValue(deriveOperationalStatus_('comprobante_generado', {
    montoTotal: montoTotal,
    montoAdelanto: montoAdelanto,
    montoSaldo: montoSaldo
  }));
  sheet.getRange(rowIndex, RES_COL.codigo_comprobante).setValue(codigoComprobante);
  sheet.getRange(rowIndex, RES_COL.url_pdf).setValue(pdfUrl);
  sheet.getRange(rowIndex, RES_COL.url_whatsapp).setValue(whatsappUrl);
}

function updateReservationCompletion_(sheet, rowIndex, record, pdfUrl, whatsappUrl) {
  sheet.getRange(rowIndex, RES_COL.monto_adelanto).setValue(record.montoAdelanto);
  sheet.getRange(rowIndex, RES_COL.monto_saldo).setValue(record.montoSaldo);
  sheet.getRange(rowIndex, RES_COL.metodo_pago).setValue(record.metodoPago);
  sheet.getRange(rowIndex, RES_COL.estado_reserva).setValue(record.estadoReserva);
  sheet.getRange(rowIndex, RES_COL.estado).setValue(record.estado);
  sheet.getRange(rowIndex, RES_COL.codigo_comprobante).setValue(record.codigoComprobante);
  sheet.getRange(rowIndex, RES_COL.url_pdf).setValue(pdfUrl);
  sheet.getRange(rowIndex, RES_COL.url_whatsapp).setValue(whatsappUrl);
  sheet.getRange(rowIndex, RES_COL.estado_pago).setValue(record.estadoPago);
}

function updateReservationPayment_(sheet, rowIndex, record) {
  sheet.getRange(rowIndex, RES_COL.monto_adelanto).setValue(record.montoAdelanto);
  sheet.getRange(rowIndex, RES_COL.monto_saldo).setValue(record.montoSaldo);
  sheet.getRange(rowIndex, RES_COL.metodo_pago).setValue(record.metodoPago);
  sheet.getRange(rowIndex, RES_COL.estado_reserva).setValue(record.estadoReserva);
  sheet.getRange(rowIndex, RES_COL.estado).setValue(record.estado);
  sheet.getRange(rowIndex, RES_COL.estado_pago).setValue(record.estadoPago);
}

function updateReservationRecord_(sheet, rowIndex, record) {
  sheet.getRange(rowIndex, RES_COL.nombre_cliente).setValue(record.nombreCliente);
  sheet.getRange(rowIndex, RES_COL.numero_documento).setValue(record.numeroDocumento);
  sheet.getRange(rowIndex, RES_COL.telefono_cliente).setValue(record.telefonoCliente);
  sheet.getRange(rowIndex, RES_COL.fecha_evento).setValue(record.fechaEvento);
  sheet.getRange(rowIndex, RES_COL.etiqueta_horario).setValue(record.etiquetaHorario);
  sheet.getRange(rowIndex, RES_COL.hora_inicio).setValue(record.horaInicio);
  sheet.getRange(rowIndex, RES_COL.hora_fin).setValue(record.horaFin);
  sheet.getRange(rowIndex, RES_COL.cantidad_personas).setValue(record.cantidadPersonas);
  sheet.getRange(rowIndex, RES_COL.tipo_evento).setValue(record.tipoEvento);
  sheet.getRange(rowIndex, RES_COL.monto_total).setValue(record.montoTotal);
  sheet.getRange(rowIndex, RES_COL.monto_adelanto).setValue(record.montoAdelanto);
  sheet.getRange(rowIndex, RES_COL.monto_saldo).setValue(record.montoSaldo);
  sheet.getRange(rowIndex, RES_COL.metodo_pago).setValue(record.metodoPago);
  sheet.getRange(rowIndex, RES_COL.observaciones).setValue(record.observaciones);
  sheet.getRange(rowIndex, RES_COL.estado_reserva).setValue(record.estadoReserva);
  sheet.getRange(rowIndex, RES_COL.estado).setValue(record.estado);
  sheet.getRange(rowIndex, RES_COL.id_cliente).setValue(record.idCliente);
  sheet.getRange(rowIndex, RES_COL.estado_pago).setValue(record.estadoPago);
  sheet.getRange(rowIndex, RES_COL.recurso).setValue(record.recurso);
}

function savePaymentMovement_(ss, entry) {
  if (safeNumber_(entry.montoPagado) === 0) {
    return;
  }

  ensureSheetWithHeaders_(ss, SHEETS.PAYMENTS, PAYMENT_HEADERS, LEGACY_PAYMENT_HEADERS);
  const codigoPago = 'PAG-' + Utilities.formatDate(new Date(), CONFIG.TIME_ZONE, 'yyyyMMddHHmmss');
  getSheetRequired_(ss, SHEETS.PAYMENTS).appendRow([
    codigoPago,
    entry.codigoReserva,
    new Date(),
    entry.idCliente,
    entry.nombreCliente,
    entry.numeroDocumento,
    entry.metodoPago,
    entry.montoPagado,
    entry.saldoResultante,
    entry.estadoPagoResultante,
    entry.tipoPago,
    entry.observacion,
    entry.recurso
  ]);
}

function upsertReceiptForReservation_(ss, record, pdf) {
  const existingFinalReceipt = findReceiptsByReservationCode_(ss, record.codigoReserva).find(function(item) {
    return item.tipoComprobante === 'pago_completado';
  });
  const rowData = [
    record.codigoComprobante,
    record.codigoReserva,
    new Date(),
    record.nombreCliente,
    record.numeroDocumento,
    record.telefonoCliente,
    record.fechaEvento,
    record.etiquetaHorario,
    record.montoTotal,
    record.montoAdelanto,
    record.montoSaldo,
    record.metodoPago,
    pdf.url,
    pdf.id,
    record.nombreArrendatario,
    record.telefonoArrendatario,
    record.idCliente,
    record.estadoPago,
    record.recurso,
    'pago_completado',
    record.montoTotal
  ];

  if (existingFinalReceipt && existingFinalReceipt.sheet && existingFinalReceipt.rowIndex) {
    existingFinalReceipt.sheet.getRange(existingFinalReceipt.rowIndex, 1, 1, rowData.length).setValues([rowData]);
    return;
  }

  getSheetRequired_(ss, SHEETS.RECEIPTS).appendRow(rowData);
}

function upsertClient_(ss, record) {
  const sheet = getSheetRequired_(ss, SHEETS.CLIENTS);
  const data = getSheetRecords_(sheet, CLIENT_HEADERS, LEGACY_CLIENT_HEADERS);
  const inputDocument = normalizeDocumentNumber_(record.numeroDocumento);
  const index = data.findIndex(function(row) {
    const item = extractClientRow_(row);
    const sameDocument = inputDocument && normalizeDocumentNumber_(item.numeroDocumento) === inputDocument;
    return sameDocument;
  });

  if (index >= 0) {
    const rowNumber = getFirstDataRow_(sheet, CLIENT_HEADERS, LEGACY_CLIENT_HEADERS) + index;
    const current = extractClientRow_(data[index]);
    const idCliente = current.idCliente || nextSequence_(ss, 'secuencia_cliente', CONFIG.CLIENT_PREFIX);
    const rowData = [
      idCliente,
      record.numeroDocumento,
      record.nombreCliente,
      record.telefonoCliente,
      current.fechaRegistro || new Date(),
      new Date()
    ];
    sheet.getRange(rowNumber, 1, 1, rowData.length).setValues([rowData]);
    return { idCliente: idCliente };
  }

  const idCliente = nextSequence_(ss, 'secuencia_cliente', CONFIG.CLIENT_PREFIX);
  sheet.appendRow([
    idCliente,
    record.numeroDocumento,
    record.nombreCliente,
    record.telefonoCliente,
    new Date(),
    new Date()
  ]);
  return { idCliente: idCliente };
}

function normalizeDocumentNumber_(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[-.]/g, '');
}

function extractClientRow_(row) {
  const firstCell = String(row[0] || '');
  if (firstCell.indexOf(CONFIG.CLIENT_PREFIX + '-') === 0) {
    return {
      idCliente: row[0],
      numeroDocumento: row[1],
      nombreCliente: row[2],
      telefono: row[3],
      fechaRegistro: row[4],
      fechaActualizacion: row[5]
    };
  }

  if (String(row[0] || '').trim() && String(row[1] || '').trim() && String(row[2] || '').trim() && row.length >= 7) {
    return {
      idCliente: '',
      numeroDocumento: row[1],
      nombreCliente: row[2],
      telefono: normalizePhone_(row[3]),
      fechaRegistro: '',
      fechaActualizacion: row[6] || ''
    };
  }

  return {
    idCliente: '',
    numeroDocumento: row[0] || '',
    nombreCliente: row[1] || '',
    telefono: normalizePhone_(row[2] || ''),
    fechaRegistro: '',
    fechaActualizacion: row[3] || ''
  };
}

function buildWhatsAppUrl_(record, pdfUrl, runtimeConfig) {
  const text = [
    'Hola ' + record.nombreCliente + ', te enviamos tu comprobante ' + record.codigoComprobante + '.',
    runtimeConfig.nombreNegocio,
    'Reserva: ' + record.codigoReserva,
    'Fecha: ' + formatSheetDate_(record.fechaEvento),
    'Horario: ' + record.etiquetaHorario,
    'Total: ' + runtimeConfig.moneda + ' ' + formatMoney_(record.montoTotal),
    'Adelanto: ' + runtimeConfig.moneda + ' ' + formatMoney_(record.montoAdelanto),
    'Saldo: ' + runtimeConfig.moneda + ' ' + formatMoney_(record.montoSaldo),
    'PDF: ' + pdfUrl
  ].join('\n');

  return 'https://wa.me/' + normalizePhone_(record.telefonoCliente) + '?text=' + encodeURIComponent(text);
}

function findReservationByCode_(ss, reservationCode) {
  const sheet = getSheetRequired_(ss, SHEETS.RESERVATIONS);
  const data = getSheetRecords_(sheet, RESERVATION_HEADERS, LEGACY_RESERVATION_HEADERS);
  const rowIndex = data.findIndex(function(row) {
    return String(row[RES_COL.codigo_reserva - 1]) === String(reservationCode);
  });

  if (rowIndex < 0) {
    return null;
  }

  return {
    sheet: sheet,
    rowIndex: getFirstDataRow_(sheet, RESERVATION_HEADERS, LEGACY_RESERVATION_HEADERS) + rowIndex,
    row: data[rowIndex]
  };
}

function findReceiptByReservationCode_(ss, reservationCode) {
  const receipts = findReceiptsByReservationCode_(ss, reservationCode);
  if (!receipts.length) {
    return null;
  }
  return receipts[receipts.length - 1];
}

function findReceiptsByReservationCode_(ss, reservationCode) {
  const sheet = getSheetRequired_(ss, SHEETS.RECEIPTS);
  const data = getSheetRecords_(sheet, RECEIPT_HEADERS, LEGACY_RECEIPT_HEADERS);
  const startRow = getFirstDataRow_(sheet, RECEIPT_HEADERS, LEGACY_RECEIPT_HEADERS);

  return data.reduce(function(found, row, index) {
    if (String(row[RECEIPT_COL.codigo_reserva - 1]) !== String(reservationCode)) {
      return found;
    }

    found.push({
      sheet: sheet,
      rowIndex: startRow + index,
      receiptCode: row[RECEIPT_COL.codigo_comprobante - 1],
      fileId: row[RECEIPT_COL.id_archivo_drive - 1],
      pdfUrl: row[RECEIPT_COL.url_pdf - 1],
      tipoComprobante: row[RECEIPT_COL.tipo_comprobante - 1] || inferReceiptTypeFromRow_(row),
      montoPagado: safeNumber_(row[RECEIPT_COL.monto_pagado - 1])
    });
    return found;
  }, []);
}

function inferReceiptTypeFromRow_(row) {
  const estadoPago = String(row[RECEIPT_COL.estado_pago - 1] || '').toLowerCase();
  if (estadoPago === 'pagado_total') {
    return 'pago_completado';
  }
  return 'adelanto';
}

function buildReceiptTypeLabel_(tipoComprobante) {
  const map = {
    adelanto: 'Adelanto',
    pago_completado: 'Pago completado',
    reembolso: 'Reembolso'
  };
  return map[String(tipoComprobante || '').toLowerCase()] || 'Comprobante';
}

function buildReceiptType_(record, advanceReceipt) {
  if (safeNumber_(record.montoSaldo) <= 0) {
    return advanceReceipt ? 'pago_completado' : 'pago_completado';
  }
  return 'adelanto';
}

function canGenerateReceiptForRecord_(record, receipts) {
  const hasAdvance = receipts.some(function(item) { return item.tipoComprobante === 'adelanto'; });
  const hasFinal = receipts.some(function(item) { return item.tipoComprobante === 'pago_completado'; });

  if (record.estadoReserva === 'cancelada') {
    return false;
  }

  if (safeNumber_(record.montoSaldo) > 0) {
    return !hasAdvance;
  }

  return !hasFinal;
}

function buildRefundReceiptRecord_(record, refundInfo, cancelReason, receiptCode) {
  return Object.assign({}, record, {
    codigoComprobante: receiptCode,
    tipoComprobante: 'reembolso',
    montoPagadoComprobante: refundInfo.refundAmount,
    montoReembolso: refundInfo.refundAmount,
    porcentajeReembolso: refundInfo.refundPercent,
    motivoCancelacion: cancelReason,
    observaciones: 'Reembolso emitido por cancelacion. Motivo: ' + cancelReason
  });
}

function buildPaymentLabel_(estadoPago) {
  const map = {
    sin_adelanto: 'Sin adelanto',
    adelanto_registrado: 'Adelanto',
    pagado_total: 'Total'
  };
  return map[estadoPago] || toTitleCase_(estadoPago || '');
}

function toTitleCase_(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, function(letter) { return letter.toUpperCase(); });
}

function buildReservationRecordFromRow_(row) {
  const col = getReservationColumnMap_(row);
  const horaInicio = row[RES_COL.hora_inicio - 1] || '';
  const horaFin = row[RES_COL.hora_fin - 1] || '';
  const etiquetaHorario = row[RES_COL.etiqueta_horario - 1] || buildScheduleLabel_(horaInicio, horaFin);
  const montoTotal = safeNumber_(row[RES_COL.monto_total - 1]);
  const montoAdelanto = safeNumber_(row[RES_COL.monto_adelanto - 1]);
  const montoSaldo = safeNumber_(row[RES_COL.monto_saldo - 1]);

  return {
    codigoReserva: row[RES_COL.codigo_reserva - 1],
    fechaRegistro: row[RES_COL.fecha_registro - 1],
    nombreCliente: row[RES_COL.nombre_cliente - 1],
    numeroDocumento: row[RES_COL.numero_documento - 1],
    telefonoCliente: row[RES_COL.telefono_cliente - 1],
    fechaEvento: row[RES_COL.fecha_evento - 1],
    etiquetaHorario: etiquetaHorario,
    horaInicio: horaInicio,
    horaFin: horaFin,
    cantidadPersonas: row[RES_COL.cantidad_personas - 1],
    tipoEvento: row[RES_COL.tipo_evento - 1],
    montoTotal: montoTotal,
    montoAdelanto: montoAdelanto,
    montoSaldo: montoSaldo,
    metodoPago: row[RES_COL.metodo_pago - 1],
    observaciones: row[RES_COL.observaciones - 1],
    estadoReserva: row[RES_COL.estado_reserva - 1] || inferLegacyReservationStatus_(row),
    estado: row[col.estado - 1] || deriveOperationalStatus_(row[RES_COL.estado_reserva - 1] || inferLegacyReservationStatus_(row), {
      montoTotal: montoTotal,
      montoAdelanto: montoAdelanto,
      montoSaldo: montoSaldo
    }),
    codigoComprobante: row[col.codigo_comprobante - 1] || '',
    urlPdf: row[col.url_pdf - 1] || '',
    urlWhatsapp: row[col.url_whatsapp - 1] || '',
    nombreArrendatario: row[col.nombre_arrendatario - 1] || '',
    telefonoArrendatario: row[col.telefono_arrendatario - 1] || '',
    idCliente: row[col.id_cliente - 1] || '',
    estadoPago: row[col.estado_pago - 1] || computePaymentStatus_({
      montoTotal: montoTotal,
      montoAdelanto: montoAdelanto,
      montoSaldo: montoSaldo
    }),
    fechaCancelacion: row[col.fecha_cancelacion - 1] || '',
    motivoCancelacion: row[col.motivo_cancelacion - 1] || '',
    porcentajeReembolso: row[col.porcentaje_reembolso - 1] || '',
    montoReembolso: row[col.monto_reembolso - 1] || '',
    recurso: row[col.recurso - 1] || SETTINGS_DEFAULTS.recurso_principal
  };
}

function getReservationColumnMap_(row) {
  const paymentCell = String(row[RES_COL.estado_pago - 1] || '').trim();
  const receiptCell = String(row[RES_COL.codigo_comprobante - 1] || '').trim().toLowerCase();
  const shifted = paymentCell.indexOf(CONFIG.CLIENT_PREFIX + '-') === 0 ||
    receiptCell === 'pendiente' ||
    receiptCell === 'completado' ||
    receiptCell === 'cancelado';

  if (!shifted) {
    return RES_COL;
  }

  return {
    codigo_reserva: RES_COL.codigo_reserva,
    fecha_registro: RES_COL.fecha_registro,
    nombre_cliente: RES_COL.nombre_cliente,
    numero_documento: RES_COL.numero_documento,
    telefono_cliente: RES_COL.telefono_cliente,
    fecha_evento: RES_COL.fecha_evento,
    etiqueta_horario: RES_COL.etiqueta_horario,
    hora_inicio: RES_COL.hora_inicio,
    hora_fin: RES_COL.hora_fin,
    cantidad_personas: RES_COL.cantidad_personas,
    tipo_evento: RES_COL.tipo_evento,
    monto_total: RES_COL.monto_total,
    monto_adelanto: RES_COL.monto_adelanto,
    monto_saldo: RES_COL.monto_saldo,
    metodo_pago: RES_COL.metodo_pago,
    observaciones: RES_COL.observaciones,
    estado_reserva: RES_COL.estado_reserva,
    codigo_comprobante: RES_COL.codigo_comprobante + 1,
    url_pdf: RES_COL.url_pdf + 1,
    url_whatsapp: RES_COL.url_whatsapp + 1,
    nombre_arrendatario: RES_COL.nombre_arrendatario + 1,
    telefono_arrendatario: RES_COL.telefono_arrendatario + 1,
    id_cliente: RES_COL.id_cliente + 1,
    estado_pago: RES_COL.estado_pago + 1,
    fecha_cancelacion: RES_COL.fecha_cancelacion + 1,
    motivo_cancelacion: RES_COL.motivo_cancelacion + 1,
    recurso: RES_COL.recurso + 1,
    estado: RES_COL.estado + 1,
    porcentaje_reembolso: RES_COL.porcentaje_reembolso + 1,
    monto_reembolso: RES_COL.monto_reembolso + 1
  };
}

function inferLegacyReservationStatus_(row) {
  const legacyStatus = String(row[16] || row[14] || '').trim().toLowerCase();
  if (legacyStatus.indexOf('cancel') >= 0) return 'cancelada';
  if (legacyStatus.indexOf('comprobante') >= 0) return 'comprobante_generado';
  if (legacyStatus) return legacyStatus;
  return 'reservada';
}

function getRuntimeConfig_() {
  let settingsMap = {};

  try {
    const ss = getSpreadsheet_();
    const sheet = ss.getSheetByName(SHEETS.SETTINGS);
    if (sheet) {
      getSheetRecords_(sheet, SETTINGS_HEADERS, LEGACY_SETTINGS_HEADERS).forEach(function(row) {
        if (row[0]) {
          settingsMap[String(row[0]).trim()] = String(row[1] || '').trim();
        }
      });
    }
  } catch (error) {
    settingsMap = {};
  }

  return {
    tituloApp: settingsMap.titulo_app || SETTINGS_DEFAULTS.titulo_app,
    nombreModulo: settingsMap.nombre_modulo || SETTINGS_DEFAULTS.nombre_modulo,
    nombreNegocio: settingsMap.nombre_negocio || SETTINGS_DEFAULTS.nombre_negocio,
    nombreArrendatario: settingsMap.nombre_arrendatario || SETTINGS_DEFAULTS.nombre_arrendatario,
    telefonoArrendatario: settingsMap.telefono_arrendatario || SETTINGS_DEFAULTS.telefono_arrendatario,
    telefonoNegocio: settingsMap.telefono_negocio || SETTINGS_DEFAULTS.telefono_negocio,
    moneda: settingsMap.moneda || SETTINGS_DEFAULTS.moneda,
    recursoPrincipal: settingsMap.recurso_principal || SETTINGS_DEFAULTS.recurso_principal,
    adelantoMinimoPorcentaje: Number(settingsMap.adelanto_minimo_porcentaje || SETTINGS_DEFAULTS.adelanto_minimo_porcentaje || 50),
    politicaCancelacion: settingsMap.politica_cancelacion || SETTINGS_DEFAULTS.politica_cancelacion,
    porcentajeReembolsoCancelacion: Number(settingsMap.porcentaje_reembolso_cancelacion || SETTINGS_DEFAULTS.porcentaje_reembolso_cancelacion || 80)
  };
}

function nextSequence_(ss, key, prefix) {
  const current = Number(getSettingValue_(ss, key, '0') || 0) + 1;
  setSettingValue_(ss, key, String(current));
  return prefix + '-' + Utilities.formatString('%06d', current);
}

function seedSettings_(ss) {
  Object.keys(SETTINGS_DEFAULTS).forEach(function(key) {
    if (getSettingValue_(ss, key, '') === '') {
      setSettingValue_(ss, key, SETTINGS_DEFAULTS[key]);
    }
  });
}

function ensureProjectSheets_(ss) {
  ensureSheetWithHeaders_(ss, SHEETS.RESERVATIONS, RESERVATION_HEADERS, LEGACY_RESERVATION_HEADERS);
  ensureSheetWithHeaders_(ss, SHEETS.RECEIPTS, RECEIPT_HEADERS, LEGACY_RECEIPT_HEADERS);
  ensureSheetWithHeaders_(ss, SHEETS.PAYMENTS, PAYMENT_HEADERS, LEGACY_PAYMENT_HEADERS);
  ensureSheetWithHeaders_(ss, SHEETS.CLIENTS, CLIENT_HEADERS, LEGACY_CLIENT_HEADERS);
  ensureSheetWithHeaders_(ss, SHEETS.SETTINGS, SETTINGS_HEADERS, LEGACY_SETTINGS_HEADERS);
}

function ensureSheetWithHeaders_(ss, name, headers, legacyHeadersList) {
  const sheet = findSheetByNameOrAlias_(ss, name) || ss.insertSheet(name);
  const knownHeaders = [headers].concat(legacyHeadersList || []);

  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else if (isKnownHeaderRow_(getRowValues_(sheet, 1, headers.length), knownHeaders)) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    sheet.insertRowsBefore(1, 1);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  removeDuplicateHeaderRows_(sheet, headers, knownHeaders);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#f7d76f');
  sheet.setFrozenRows(1);
}

function assertProjectReady_(ss) {
  getSheetRequired_(ss, SHEETS.RESERVATIONS);
  getSheetRequired_(ss, SHEETS.RECEIPTS);
  getSheetRequired_(ss, SHEETS.CLIENTS);
  getSheetRequired_(ss, SHEETS.SETTINGS);
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

function getSheetRequired_(ss, name) {
  const sheet = findSheetByNameOrAlias_(ss, name);
  if (!sheet) {
    throw new Error('No existe la hoja "' + name + '". Ejecuta setup() y verifica los nombres.');
  }
  return sheet;
}

function findSheetByNameOrAlias_(ss, name) {
  const direct = ss.getSheetByName(name);
  if (direct) {
    return direct;
  }

  const aliases = SHEET_ALIASES[name] || [];
  for (let i = 0; i < aliases.length; i++) {
    const aliasSheet = ss.getSheetByName(aliases[i]);
    if (aliasSheet) {
      return aliasSheet;
    }
  }

  return null;
}

function getSettingValue_(ss, key, fallbackValue) {
  const sheet = getSheetRequired_(ss, SHEETS.SETTINGS);
  const data = getSheetRecords_(sheet, SETTINGS_HEADERS, LEGACY_SETTINGS_HEADERS);
  const row = data.find(function(item) {
    return String(item[0]) === String(key);
  });
  return row ? String(row[1] || '') : fallbackValue;
}

function setSettingValue_(ss, key, value) {
  const sheet = getSheetRequired_(ss, SHEETS.SETTINGS);
  const data = getSheetRecords_(sheet, SETTINGS_HEADERS, LEGACY_SETTINGS_HEADERS);
  const rowIndex = data.findIndex(function(item) {
    return String(item[0]) === String(key);
  });

  if (rowIndex >= 0) {
    const rowNumber = getFirstDataRow_(sheet, SETTINGS_HEADERS, LEGACY_SETTINGS_HEADERS) + rowIndex;
    sheet.getRange(rowNumber, 2).setValue(value);
  } else {
    sheet.appendRow([key, value]);
  }
}

function getLogoDataUrl_() {
  if (!CONFIG.LOGO_FILE_ID) return '';
  try {
    const blob = DriveApp.getFileById(CONFIG.LOGO_FILE_ID).getBlob();
    return 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes());
  } catch (error) {
    return '';
  }
}

function getLogoPublicUrl_() {
  if (!CONFIG.LOGO_FILE_ID) return '';
  return 'https://drive.google.com/uc?export=view&id=' + CONFIG.LOGO_FILE_ID;
}

function getPdfAsBase64(fileId) {
  const cleanFileId = clean_(fileId);
  if (!cleanFileId) {
    throw new Error('No se indico el archivo PDF a compartir.');
  }

  try {
    const file = DriveApp.getFileById(cleanFileId);
    const blob = file.getBlob();
    return {
      base64: Utilities.base64Encode(blob.getBytes()),
      name: file.getName() || (cleanFileId + '.pdf'),
      mimeType: blob.getContentType() || MimeType.PDF
    };
  } catch (error) {
    throw new Error('No se pudo preparar el PDF para compartir.');
  }
}

function validateReservation_(form) {
  const required = [
    'nombre',
    'documento',
    'telefono',
    'fechaEvento',
    'schedule_slot',
    'personas',
    'tipoEvento',
    'montoTotal',
    'adelanto',
    'metodoPago'
  ];

  const missing = required.filter(function(field) {
    return !String(form[field] || '').trim();
  });

  if (missing.length) {
    throw new Error('Completa los campos obligatorios antes de guardar.');
  }

  const totals = calculateTotals_(form);

  if (totals.montoTotal <= 0) {
    throw new Error('El monto total debe ser mayor a cero.');
  }

  if (totals.adelanto < 0 || totals.adelanto > totals.montoTotal) {
    throw new Error('El adelanto no puede ser negativo ni mayor al monto total.');
  }

  if (Number(form.personas || 0) <= 0) {
    throw new Error('La cantidad de personas debe ser mayor a cero.');
  }

  if (!/^\d{8,15}$/.test(String(form.telefono || '').replace(/\D/g, ''))) {
    throw new Error('Ingresa un telefono valido.');
  }
}

function assertMinimumDeposit_(totals, runtimeConfig) {
  const minPercent = Number(runtimeConfig.adelantoMinimoPorcentaje || 50);
  const minAmount = Number(totals.montoTotal || 0) * (minPercent / 100);
  if (Number(totals.adelanto || 0) < minAmount) {
    throw new Error('El adelanto minimo para reservar es ' + minPercent + '% del monto total.');
  }
}

function assertReservationAvailability_(ss, fechaEvento, horaInicio, horaFin, excludeReservationCode, recurso) {
  const sheet = getSheetRequired_(ss, SHEETS.RESERVATIONS);
  const rows = getSheetRecords_(sheet, RESERVATION_HEADERS, LEGACY_RESERVATION_HEADERS);
  const requestedDate = normalizeDateKey_(fechaEvento);
  const requestedResource = String(recurso || SETTINGS_DEFAULTS.recurso_principal).trim().toLowerCase();

  const conflict = rows.some(function(row) {
    const record = buildReservationRecordFromRow_(row);
    if (!record.codigoReserva || record.codigoReserva === excludeReservationCode) {
      return false;
    }

    if (!isActiveReservationState_(record.estadoReserva)) {
      return false;
    }

    if (normalizeDateKey_(record.fechaEvento) !== requestedDate) {
      return false;
    }

    const recordResource = String(record.recurso || SETTINGS_DEFAULTS.recurso_principal).trim().toLowerCase();
    return recordResource === requestedResource;
  });

  if (conflict) {
    throw new Error('Ya existe una reserva activa para esa fecha en este recreo. Solo se permite un evento por dia.');
  }
}

function isActiveReservationState_(status) {
  return String(status || '').toLowerCase() !== 'cancelada';
}

function isTimeRangeOverlap_(startA, endA, startB, endB) {
  if (!startA || !endA || !startB || !endB) {
    return false;
  }
  return startA < endB && startB < endA;
}

function parseTimeToMinutes_(value) {
  const cleanValue = String(value || '').trim();
  const match = cleanValue.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

function computePaymentStatus_(recordOrTotals) {
  const total = Number(recordOrTotals.montoTotal || 0);
  const adelanto = Number(recordOrTotals.montoAdelanto != null ? recordOrTotals.montoAdelanto : recordOrTotals.adelanto || 0);
  const saldo = Number(recordOrTotals.montoSaldo != null ? recordOrTotals.montoSaldo : recordOrTotals.saldo || total - adelanto);

  if (total <= 0 || adelanto <= 0) {
    return 'sin_adelanto';
  }

  if (saldo <= 0) {
    return 'pagado_total';
  }

  return 'adelanto_registrado';
}

function deriveOperationalStatus_(reservationStatus, recordOrTotals) {
  const status = String(reservationStatus || '').toLowerCase();
  if (status === 'cancelada') {
    return 'cancelado';
  }

  const saldo = Number(recordOrTotals.montoSaldo != null ? recordOrTotals.montoSaldo : recordOrTotals.saldo || 0);
  if (saldo <= 0) {
    return 'completado';
  }

  return 'pendiente';
}

function computeCancellationRefund_(record, runtimeConfig) {
  const refundPercent = Number(runtimeConfig.porcentajeReembolsoCancelacion || 80);
  const paidAmount = Math.max(0, safeNumber_(record.montoTotal) - safeNumber_(record.montoSaldo));
  const refundAmount = Number((paidAmount * (refundPercent / 100)).toFixed(2));

  return {
    refundPercent: refundPercent,
    paidAmount: Number(paidAmount.toFixed(2)),
    refundAmount: refundAmount
  };
}

function isReservationClosedForCancellation_(record) {
  if (String(record.estadoReserva || '').toLowerCase() === 'cancelada') {
    return true;
  }

  const eventKey = normalizeDateKey_(record.fechaEvento);
  const todayKey = Utilities.formatDate(new Date(), CONFIG.TIME_ZONE, 'yyyy-MM-dd');
  return Boolean(eventKey) && eventKey < todayKey;
}

function getScheduleOptions_() {
  return [
    { value: '10:00|17:30|10:00 am - 5:30 pm', label: '10:00 am - 5:30 pm' },
    { value: '10:00|18:00|10:00 am - 6:00 pm', label: '10:00 am - 6:00 pm' },
    { value: '10:00|20:00|10:00 am - 8:00 pm', label: '10:00 am - 8:00 pm' },
    { value: '18:00|20:00|6:00 pm - 8:00 pm', label: '6:00 pm - 8:00 pm' }
  ];
}

function buildSchedule_(slotValue) {
  const parts = String(slotValue || '').split('|');
  if (parts.length !== 3) {
    throw new Error('Selecciona un horario valido.');
  }

  return {
    startTime: parts[0],
    endTime: parts[1],
    label: parts[2]
  };
}

function buildScheduleLabel_(startTime, endTime) {
  if (!startTime || !endTime) return '';
  return formatTimeLabel_(startTime) + ' - ' + formatTimeLabel_(endTime);
}

function formatTimeLabel_(timeValue) {
  const match = String(timeValue || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return String(timeValue || '');
  const hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? 'pm' : 'am';
  const displayHour = ((hour + 11) % 12) + 1;
  return displayHour + ':' + minute + ' ' + suffix;
}

function calculateTotals_(form) {
  const montoTotal = Number(form.montoTotal || 0);
  const adelanto = Number(form.adelanto || 0);
  return {
    montoTotal: montoTotal,
    adelanto: adelanto,
    saldo: montoTotal - adelanto
  };
}

function clean_(value) {
  return String(value || '').trim();
}

function normalizeCustomerName_(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePhone_(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.indexOf('51') === 0 ? digits : '51' + digits;
}

function formatMoney_(value) {
  return Number(value || 0).toFixed(2);
}

function safeNumber_(value) {
  const numberValue = Number(value || 0);
  return isNaN(numberValue) ? 0 : numberValue;
}

function formatSheetDate_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, CONFIG.TIME_ZONE, 'dd/MM/yyyy');
  }

  const dateKey = normalizeDateKey_(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return dateKey.split('-').reverse().join('/');
  }

  return value;
}

function formatSheetDateTime_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, CONFIG.TIME_ZONE, 'dd/MM/yyyy HH:mm');
  }
  return value;
}

function normalizeDateKey_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, CONFIG.TIME_ZONE, 'yyyy-MM-dd');
  }

  const text = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    return [
      match[3],
      Utilities.formatString('%02d', Number(match[2])),
      Utilities.formatString('%02d', Number(match[1]))
    ].join('-');
  }

  return text;
}

function getRowValues_(sheet, rowNumber, width) {
  return sheet.getRange(rowNumber, 1, 1, width).getValues()[0];
}

function isKnownHeaderRow_(row, headerCandidates) {
  return headerCandidates.some(function(candidate) {
    return candidate.every(function(header, index) {
      return String(row[index] || '').trim() === header;
    });
  });
}

function removeDuplicateHeaderRows_(sheet, headers, knownHeaders) {
  for (let rowIndex = sheet.getLastRow(); rowIndex >= 2; rowIndex--) {
    const rowValues = getRowValues_(sheet, rowIndex, headers.length);
    if (isKnownHeaderRow_(rowValues, knownHeaders)) {
      sheet.deleteRow(rowIndex);
    }
  }
}

function getFirstDataRow_(sheet, headers, legacyHeadersList) {
  const firstRow = getRowValues_(sheet, 1, headers.length);
  return isKnownHeaderRow_(firstRow, [headers].concat(legacyHeadersList || [])) ? 2 : 1;
}

function getSheetRecords_(sheet, headers, legacyHeadersList) {
  const all = sheet.getDataRange().getValues();
  if (!all.length) return [];

  const knownHeaders = [headers].concat(legacyHeadersList || []);
  const startIndex = getFirstDataRow_(sheet, headers, legacyHeadersList) - 1;

  return all.slice(startIndex).filter(function(row) {
    if (isKnownHeaderRow_(row, knownHeaders)) {
      return false;
    }
    return row.some(function(cell) {
      return String(cell || '').trim() !== '';
    });
  });
}

function buildDriveDownloadUrl_(fileId) {
  return fileId ? 'https://drive.google.com/uc?export=download&id=' + fileId : '';
}

function ensureReceiptFolderPath_(dateValue) {
  const rootFolder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const folderDate = dateValue || new Date();
  const yearName = Utilities.formatDate(folderDate, CONFIG.TIME_ZONE, 'yyyy');
  const monthName = Utilities.formatDate(folderDate, CONFIG.TIME_ZONE, 'MM');
  const dayName = Utilities.formatDate(folderDate, CONFIG.TIME_ZONE, 'dd');

  const yearFolder = getOrCreateChildFolder_(rootFolder, yearName);
  const monthFolder = getOrCreateChildFolder_(yearFolder, monthName);
  return getOrCreateChildFolder_(monthFolder, dayName);
}

function getOrCreateChildFolder_(parentFolder, folderName) {
  const iterator = parentFolder.getFoldersByName(folderName);
  return iterator.hasNext() ? iterator.next() : parentFolder.createFolder(folderName);
}

function buildReceiptFileName_(record) {
  const receiptCode = sanitizeFilePart_(record.codigoComprobante || 'COMPROBANTE');
  const documentNumber = sanitizeFilePart_(record.numeroDocumento || 'SIN_DNI');
  return receiptCode + '_' + documentNumber + '.pdf';
}

function sanitizeFilePart_(value) {
  return String(value || '')
    .trim()
    .replace(/[\\/:*?"<>|#%&{}$!'@+=`]/g, '_')
    .replace(/\s+/g, '_');
}

function backfillReservationClientIds_(ss) {
  const sheet = getSheetRequired_(ss, SHEETS.RESERVATIONS);
  const data = getSheetRecords_(sheet, RESERVATION_HEADERS, LEGACY_RESERVATION_HEADERS);
  const startRow = getFirstDataRow_(sheet, RESERVATION_HEADERS, LEGACY_RESERVATION_HEADERS);

  data.forEach(function(row, index) {
    const record = buildReservationRecordFromRow_(row);
    if (!record.codigoReserva) {
      return;
    }

    if (!record.idCliente) {
      const clientData = upsertClient_(ss, {
        numeroDocumento: record.numeroDocumento,
        nombreCliente: record.nombreCliente,
        telefonoCliente: normalizePhone_(record.telefonoCliente)
      });
      sheet.getRange(startRow + index, RES_COL.id_cliente).setValue(clientData.idCliente);
    }

    if (!row[RES_COL.estado_pago - 1]) {
      sheet.getRange(startRow + index, RES_COL.estado_pago).setValue(record.estadoPago);
    }

    if (!row[RES_COL.estado - 1]) {
      sheet.getRange(startRow + index, RES_COL.estado).setValue(record.estado);
    }

    if (!row[RES_COL.recurso - 1]) {
      sheet.getRange(startRow + index, RES_COL.recurso).setValue(SETTINGS_DEFAULTS.recurso_principal);
    }
  });
}

function makeIndexMap_(headers) {
  return headers.reduce(function(map, header, index) {
    map[header] = index + 1;
    return map;
  }, {});
}
