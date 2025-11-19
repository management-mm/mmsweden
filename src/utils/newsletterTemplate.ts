import type { IProduct } from '@interfaces/IProduct';

import getProductName from './getProductName';

import { LanguageKeys } from '@enums/languageKeys';

export const mainProductBlock = (product: IProduct) => `
<table width="100%" cellpadding="0" cellspacing="0"
                                                            bgcolor="#f5f6f7"
                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#f5f6f7;border-radius:10px"
                                                            role="presentation">
                                                            <tr>
                                                                <td align="center"
                                                                    style="padding:0;Margin:0;font-size:0px"><a
                                                                        href="https://www.mmsweden.se/all-products/${product._id}"
                                                                        target="_blank"
                                                                        style="mso-line-height-rule:exactly;text-decoration:underline;color:#00179C;font-size:15px"><img
                                                                            width="560" alt="Main Image"
                                                                            src=${product.photos[0]}
                                                                            title="Main Image" class="adapt-img"
                                                                            style="display:block;font-size:15px;border:0;outline:none;text-decoration:none;margin:0;border-radius:10px 10px 0px 0px"
                                                                            height="420"></a> </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" class="cc dr dq"
                                                                    style="Margin:0;padding-right:40px;padding-left:40px;padding-bottom:5px;padding-top:15px">
                                                                    <h3 class="cz br"
                                                                        style="Margin:0;font-family:montserrat, helvetica, arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:16px;color:#000000">
                                                                        <strong>${getProductName(product.name, LanguageKeys.EN)}</strong></h3>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" class="cc dr dq"
                                                                    style="Margin:0;padding-right:40px;padding-left:40px;padding-bottom:5px;padding-top:5px">
                                                                    <h3 class="cz br"
                                                                        style="Margin:0;font-family:montserrat, helvetica, arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:14px;font-style:normal;font-weight:normal;line-height:21px;color:#004b87">
                                                                        <strong>ID NR ${product.idNumber}</strong></h3>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" class="cb dp do"
                                                                    style="Margin:0;padding-top:5px;padding-bottom:10px;padding-right:25px;padding-left:25px">
                                                                    <p class="cz bt"
                                                                        style="Margin:0;mso-line-height-rule:exactly;font-family:inter, sans-serif;line-height:13px;letter-spacing:0;color:#4d4d4d;font-size:13px">
                                                                        ${product.description.en}</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center"
                                                                    style="Margin:0;padding-left:5px;padding-right:5px;padding-bottom:20px;padding-top:5px">
                                                                    <!--[if mso]><a href="https://www.mmsweden.se/all-products/${product._id}" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://www.mmsweden.se/all-products/${product._id}" style="height:35px; v-text-anchor:middle; width:151px" arcsize="50%" stroke="f" fillcolor="#fdc62f"> <w:anchorlock></w:anchorlock> <center style='color:#000000; font-family:Inter, sans-serif; font-size:12px; font-weight:700; line-height:12px; mso-text-raise:1px'>Check it Out!</center> </v:roundrect></a>
<![endif]-->
                                                                    <!--[if !mso]><!-- --><span class="msohide cw"
                                                                        style="border-style:solid;border-color:transparent;background:#fdc62f;border-width:0px;display:inline-block;border-radius:50px;width:auto;mso-hide:all"><a
                                                                            href=${product.photos[0]}
                                                                            target="_blank" class="cs"
                                                                            style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#000000;font-size:13px;padding:10px 25px;display:inline-block;background:#fdc62f;border-radius:50px;font-family:Inter, sans-serif;font-weight:bold;font-style:normal;line-height:15.6px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #fdc62f">Check
                                                                            it Out!</a> </span>
                                                                    <!--<![endif]-->
                                                                </td>
                                                            </tr>
                                                        </table>
`;

export const productBlock = (product: IProduct) => `
<table width="100%" cellpadding="0" cellspacing="0"
                bgcolor="#f5f6f7"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#f5f6f7;border-radius:10px"
                role="presentation">
                <tr>
                    <td align="center"
                        style="padding-bottom:20px;Margin:0;font-size:0px"><a
                            href="https://www.mmsweden.se/all-products/${product._id}"
                            target="_blank"
                            style="mso-line-height-rule:exactly;text-decoration:underline;color:#00179C;font-size:15px"><img
                                width="270" alt="Main Image"
                                src=${product.photos[0]}
                                title="Main Image" class="adapt-img"
                                style="display:block;font-size:15px;border:0;outline:none;text-decoration:none;margin:0;border-radius:10px 10px 0px 0px"
                                height="203"></a> </td>
                </tr>
                <tr>
                    <td align="center" class="cc dr dq"
                        style="Margin:0;padding-right:40px;padding-left:40px;padding-bottom:5px;padding-top:15px">
                        <h3 class="cz br"
                            style="Margin:0;font-family:montserrat, helvetica, arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:16px;color:#000000">
                            <strong>${getProductName(product.name, LanguageKeys.EN)}</strong></h3>
                    </td>
                </tr>
                <tr>
                    <td align="center" class="cc dr dq"
                        style="Margin:0;padding-right:40px;padding-left:40px;padding-bottom:5px;padding-top:5px">
                        <h3 class="cz br"
                            style="Margin:0;font-family:montserrat, helvetica, arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:14px;font-style:normal;font-weight:normal;line-height:21px;color:#004b87">
                            <strong>ID NR ${product.idNumber}</strong></h3>
                    </td>
                </tr>
                <tr>
                    <td align="center" class="cb dp do"
                        style="Margin:0;padding-top:5px;padding-bottom:10px;padding-right:25px;padding-left:25px">
                        <p class="cz bt"
                            style="Margin:0;mso-line-height-rule:exactly;font-family:inter, sans-serif;line-height:13px;letter-spacing:0;color:#4d4d4d;font-size:13px">
                            ${product.description.en}</p>
                    </td>
                </tr>
                <tr>
                    <td align="center"
                        style="Margin:0;padding-left:5px;padding-right:5px;padding-bottom:20px;padding-top:5px">
                        <!--[if mso]><a href="https://www.mmsweden.se/all-products/${product._id}" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://www.mmsweden.se/all-products/${product._id}" style="height:35px; v-text-anchor:middle; width:151px" arcsize="50%" stroke="f" fillcolor="#fdc62f"> <w:anchorlock></w:anchorlock> <center style='color:#000000; font-family:Inter, sans-serif; font-size:12px; font-weight:700; line-height:12px; mso-text-raise:1px'>Check it Out!</center> </v:roundrect></a><![endif]-->
                        <!--[if !mso]><!-- -->
                        <span class="msohide cw"
                            style="border-style:solid;border-color:transparent;background:#fdc62f;border-width:0px;display:inline-block;border-radius:50px;width:auto;mso-hide:all">
                            <a href="https://www.mmsweden.se/all-products/${product._id}"
                                target="_blank" class="cs"
                                style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#000000;font-size:13px;padding:10px 25px;display:inline-block;background:#fdc62f;border-radius:50px;font-family:Inter, sans-serif;font-weight:bold;font-style:normal;line-height:15.6px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #fdc62f">
                                Check it Out!
                            </a>
                        </span>
                        <!--<![endif]-->
                    </td>
                </tr>
            </table>

`;

export const buildNewsletterHtml = (products: IProduct[]) => {
  const productsHtml = products
    .slice(1)
    .map((product, index) => {
      const marginRight = (index + 1) % 2 !== 0 ? '20px' : '0';
      return `
      <table cellspacing="0" cellpadding="0" align="left" class="cp" role="none"
          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;width:270px;margin-right:${marginRight};margin-bottom:10px;">
        <tr>
          <td>
            ${productBlock(product)}
          </td>
        </tr>
      </table>
    `;
    })
    .join('');

  return `
    <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no">
    <title>MM Sweden</title>
    <!--[if (mso 16)]><style type="text/css"> a {text-decoration: none;}  </style><![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]><noscript> <xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript>
<![endif]-->
    <!--[if mso]><xml> <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"> <w:DontUseAdvancedTypographyReadingMail></w:DontUseAdvancedTypographyReadingMail> </w:WordDocument> </xml>
<![endif]-->
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    <!--<![endif]-->
    <style type="text/css">
        .rollover:hover .rollover-first {
            max-height: 0px !important;
            display: none !important;
        }

        .rollover:hover .rollover-second {
            max-height: none !important;
            display: block !important;
        }

        .rollover span {
            font-size: 0px;
        }

        u+.body img~div div {
            display: none;
        }

        #outlook a {
            padding: 0;
        }

        span.MsoHyperlink,
        span.MsoHyperlinkFollowed {
            color: inherit;
            mso-style-priority: 99;
        }

        a.cs {
            mso-style-priority: 100 !important;
            text-decoration: none !important;
        }

        a[x-apple-data-detectors],
        #MessageViewBody a {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        .cg {
            display: none;
            float: left;
            overflow: hidden;
            width: 0;
            max-height: 0;
            line-height: 0;
            mso-hide: all;
        }

        @media only screen and (max-width:600px) {
            h1 {
                font-size: 28px !important;
                text-align: center
            }

            h2 {
                font-size: 22px !important;
                text-align: center
            }

            h3 {
                font-size: 18px !important;
                text-align: center
            }

            .dt {
                padding-right: 10px !important
            }

            .ds {
                padding-left: 10px !important
            }

            .dr {
                padding-right: 5px !important
            }

            .dq {
                padding-left: 5px !important
            }

            .dp {
                padding-right: 15px !important
            }

            .do {
                padding-left: 15px !important
            }

            .dh {
                padding-bottom: 20px !important
            }

            *[class="gmail-fix"] {
                display: none !important
            }

            p,
            a {
                line-height: 150% !important
            }

            h1,
            h1 a {
                line-height: 120% !important
            }

            h2,
            h2 a {
                line-height: 120% !important
            }

            h3,
            h3 a {
                line-height: 120% !important
            }

            h4,
            h4 a {
                line-height: 120% !important
            }

            h5,
            h5 a {
                line-height: 120% !important
            }

            h6,
            h6 a {
                line-height: 120% !important
            }

            .de p {}

            .dd p {}

            h4 {
                font-size: 24px !important;
                text-align: left
            }

            h5 {
                font-size: 20px !important;
                text-align: left
            }

            h6 {
                font-size: 16px !important;
                text-align: left
            }

            .de p,
            .de a {
                font-size: 16px !important
            }

            .dd p,
            .dd a {
                font-size: 13px !important
            }

            .cz,
            .cz h1,
            .cz h2,
            .cz h3,
            .cz h4,
            .cz h5,
            .cz h6 {
                text-align: center !important
            }

            .cy .rollover:hover .rollover-second,
            .cz .rollover:hover .rollover-second,
            .da .rollover:hover .rollover-second {
                display: inline !important
            }

            a.cs,
            button.cs {
                font-size: 14px !important;
                line-height: 120% !important
            }

            a.cs,
            button.cs,
            .cw {
                display: inline-block !important
            }

            .cr,
            .cr .cs,
            .ct,
            .ct td,
            .ce.cd {
                display: inline-block !important
            }

            .co table,
            .cp,
            .cq {
                width: 100% !important
            }

            .cl table,
            .cm table,
            .cn table,
            .cl,
            .cn,
            .cm {
                width: 100% !important;
                max-width: 600px !important
            }

            .adapt-img {
                width: 100% !important;
                height: auto !important
            }

            .ci,
            .cj {
                display: none !important
            }

            .cg {
                width: auto !important;
                overflow: visible !important;
                float: none !important;
                max-height: inherit !important;
                line-height: inherit !important;
                display: table-row !important
            }

            tr.cg {
                display: table-row !important
            }

            table.cd,
            .esd-block-html table {
                width: auto !important
            }

            .h-auto {
                height: auto !important
            }

            .cc .br,
            .cc .br * {
                font-size: 16px !important;
                line-height: 150% !important
            }

            .cb .bt,
            .cb .bt * {
                font-size: 14px !important;
                line-height: 150% !important
            }

            .bk .bl.bm,
            .bk .bl.bm * {
                font-size: 10px !important;
                line-height: 150% !important
            }

            .q {
                padding-right: 25px !important
            }

            .p {
                padding-left: 25px !important
            }
        }

        @media screen and (max-width:384px) {
            .mail-message-content {
                width: 414px !important
            }
        }
    </style>
</head>

<body class="body"
    style="width:100%;height:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
    <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#F5F6F7">
        <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#f5f6f7"></v:fill> </v:background><![endif]-->
        <table cellpadding="0" cellspacing="0" width="100%" class="es-wrapper" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F5F6F7">
            <tr>
                <td valign="top" style="padding:0;Margin:0">
                    <table align="center" cellpadding="0" cellspacing="0" class="cl" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table align="center" cellpadding="0" cellspacing="0" class="de"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;border-radius:20px 20px 0px 0px;width:600px"
                                    role="none">
                                    <tr>
                                        <td align="left" style="padding:0;Margin:0">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr>
                                                    <td align="center" valign="top"
                                                        style="padding:0;Margin:0;width:600px">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation"
                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td align="center" height="25"
                                                                    style="padding:0;Margin:0"></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table cellspacing="0" align="center" cellpadding="0" class="cl" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table align="center" bgcolor="#fff" cellpadding="0" cellspacing="0" class="de"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;border-radius:20px 20px 0px 0px;width:600px"
                                    role="none">
                                    <tr>
                                        <td align="left" style="padding:0;Margin:0">
                                            <table width="100%" cellpadding="0" cellspacing="0" role="none"
                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr>
                                                    <td align="center" valign="top"
                                                        style="padding:0;Margin:0;width:600px">
                                                        <table width="100%" cellpadding="0" cellspacing="0"
                                                            role="presentation"
                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td align="center"
                                                                    style="padding:15px;Margin:0;font-size:0px"><a
                                                                        href="https://www.mmsweden.se/" target="_blank"
                                                                        style="mso-line-height-rule:exactly;text-decoration:underline;color:#00179C;font-size:15px"><img
                                                                            title="Logo" width="175" alt="Logo"
                                                                            src="https://dccld.stripocdn.email/content/guids/CABINET_df63194db6cb408d82ccda0abee83246/images/logo.png"
                                                                            style="display:block;font-size:15px;border:0;outline:none;text-decoration:none;margin:0"
                                                                            height="89"></a> </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table align="center" cellpadding="0" cellspacing="0" class="cl" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table cellspacing="0" align="center" bgcolor="#004b87" cellpadding="0" class="de"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#004b87;width:600px"
                                    role="none">
                                    <tr>
                                        <td align="left" class="dt ds"
                                            style="Margin:0;padding-top:20px;padding-right:40px;padding-bottom:20px;padding-left:40px">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr>
                                                    <td valign="top" align="center"
                                                        style="padding:0;Margin:0;width:520px">
                                                        <table cellspacing="0" width="100%" cellpadding="0"
                                                            role="presentation"
                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td align="center" class="dr dq cc"
                                                                    style="Margin:0;padding-right:40px;padding-left:40px;padding-top:10px;padding-bottom:5px">
                                                                    <h2 class="cz"
                                                                        style="Margin:0;font-family:montserrat, helvetica, arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:22px;font-style:normal;font-weight:normal;line-height:22px;color:#ffffff">
                                                                        <strong>Check out our <span
                                                                                style="color:#FCC52F">SPECIAL for
                                                                                YOU</span> selection of equipment for
                                                                            this week</strong></h2>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" class="cb dp do"
                                                                    style="Margin:0;padding-right:40px;padding-left:40px;padding-bottom:5px;padding-top:5px">
                                                                    <p class="cz bt"
                                                                        style="Margin:0;mso-line-height-rule:exactly;font-family:inter, sans-serif;line-height:25.5px;letter-spacing:0;color:#ffffff;font-size:17px">
                                                                        3rd - 9th November 2025</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" style="padding:5px;Margin:0">
                                                                    <!--[if mso]><a href="https://www.mmsweden.se/all-products" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://www.mmsweden.se/all-products" style="height:35px; v-text-anchor:middle; width:151px" arcsize="50%" stroke="f" fillcolor="#fdc62f"> <w:anchorlock></w:anchorlock> <center style='color:#000000; font-family:Inter, sans-serif; font-size:12px; font-weight:700; line-height:12px; mso-text-raise:1px'>Check it Out!</center> </v:roundrect></a>
<![endif]-->
                                                                    <!--[if !mso]><!-- --><span class="msohide cw"
                                                                        style="border-style:solid;border-color:transparent;background:#fdc62f;border-width:0px;display:inline-block;border-radius:50px;width:auto;mso-hide:all"><a
                                                                            href="https://www.mmsweden.se/all-products"
                                                                            target="_blank" class="cs"
                                                                            style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#000000;font-size:13px;padding:10px 25px;display:inline-block;background:#fdc62f;border-radius:50px;font-family:Inter, sans-serif;font-weight:bold;font-style:normal;line-height:15.6px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #fdc62f">Check
                                                                            it Out!</a> </span>
                                                                    <!--<![endif]-->
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table align="center" cellpadding="0" cellspacing="0" class="cl" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table bgcolor="#fff" align="center" cellpadding="0" cellspacing="0" class="de"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px"
                                    role="none">
                                    <tr>
                                        <td align="left" class="dt ds"
                                            style="Margin:0;padding-top:30px;padding-bottom:20px;padding-right:30px;padding-left:30px">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr>
                                                    <td align="left" style="padding:0;Margin:0;width:540px">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:10px;background-color:#fdc62f"
                                                            bgcolor="#fdc62f" role="presentation">
                                                            <tr>
                                                                <td align="center"
                                                                    style="Margin:0;padding-left:5px;padding-right:5px;padding-bottom:5px;padding-top:15px;font-size:0px">
                                                                    <a href="https://www.mmsweden.se/" target="_blank"
                                                                        style="mso-line-height-rule:exactly;text-decoration:underline;color:#00179C;font-size:15px"><img
                                                                            title="Logo" width="50" alt="Logo"
                                                                            src="https://dccld.stripocdn.email/content/guids/CABINET_df63194db6cb408d82ccda0abee83246/images/announcement_1.png"
                                                                            style="display:block;font-size:15px;border:0;outline:none;text-decoration:none;margin:0"
                                                                            height="50"></a> </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" class="cz"
                                                                    style="Margin:0;padding-right:40px;padding-left:40px;padding-bottom:5px;padding-top:5px">
                                                                    <p
                                                                        style="Margin:0;mso-line-height-rule:exactly;font-family:inter, sans-serif;line-height:24px;letter-spacing:0;color:#333333;font-size:16px">
                                                                        We are personally sending you this email so that
                                                                        you can be the first to see out latest arrivals.
                                                                        These machines do not sit idle for months, so
                                                                        please contact us as soon as possible if you are
                                                                        interested in any of these machines.</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" class="cc q p"
                                                                    style="Margin:0;padding-right:40px;padding-bottom:20px;padding-left:40px;padding-top:10px">
                                                                    <h3 class="cz br"
                                                                        style="Margin:0;font-family:montserrat, helvetica, arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:19px;font-style:normal;font-weight:normal;line-height:19px;color:#004b87">
                                                                        <strong>DON'T MISS THIS OPPORTUNITY!</strong>
                                                                    </h3>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table align="center" cellpadding="0" cellspacing="0" class="cl" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table cellspacing="0" align="center" bgcolor="#004b87" cellpadding="0" class="de"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#004b87;width:600px"
                                    role="none">
                                    <tr>
                                        <td align="left" class="dt ds"
                                            style="Margin:0;padding-top:20px;padding-right:40px;padding-bottom:20px;padding-left:40px">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr>
                                                    <td valign="top" align="center"
                                                        style="padding:0;Margin:0;width:520px">
                                                        <table cellspacing="0" width="100%" cellpadding="0"
                                                            role="presentation"
                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td align="center" class="dr dq cc"
                                                                    style="Margin:0;padding-right:40px;padding-left:40px;padding-top:10px;padding-bottom:5px">
                                                                    <h2 class="cz br"
                                                                        style="Margin:0;font-family:montserrat, helvetica, arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:22px;font-style:normal;font-weight:normal;line-height:22px;color:#ffffff">
                                                                        <b>DEAL OF THE WEEK</b></h2>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table align="center" cellpadding="0" cellspacing="0" class="cl" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table align="center" bgcolor="#fff" cellpadding="0" cellspacing="0" class="de"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px"
                                    role="none">
                                    <tr>
                                        <td align="left" style="padding:20px;Margin:0">
                                            <table cellspacing="0" cellpadding="0" width="100%" role="none"
                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr>
                                                    <td align="left" style="padding:0;Margin:0;width:560px">
                                                        ${mainProductBlock(products[0])}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table align="center" cellpadding="0" cellspacing="0" class="cl" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table align="center" bgcolor="#fff" cellpadding="0" cellspacing="0" class="de"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px"
                                    role="none">
                                    <tr>
                                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px;padding-right:20px;padding-left:20px">
                                            <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                                            ${productsHtml}
                                            <!--[if mso]></td></tr></table><![endif]-->
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table align="center" cellpadding="0" cellspacing="0" class="cl" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table cellspacing="0" align="center" bgcolor="#fff" cellpadding="0" class="de"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px"
                                    role="none">
                                    <tr>
                                        <td align="left" class="dt ds"
                                            style="padding:0;Margin:0;padding-right:40px;padding-bottom:20px;padding-left:40px">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr>
                                                    <td valign="top" align="center"
                                                        style="padding:0;Margin:0;width:520px">
                                                        <table cellspacing="0" width="100%" cellpadding="0"
                                                            role="presentation"
                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td align="center"
                                                                    style="Margin:0;padding-left:5px;padding-right:5px;padding-bottom:5px;padding-top:15px;font-size:0px">
                                                                    <a href="https://www.mmsweden.se/" target="_blank"
                                                                        style="mso-line-height-rule:exactly;text-decoration:underline;color:#00179C;font-size:15px"><img
                                                                            title="Logo" width="50" alt="Logo"
                                                                            src="https://dccld.stripocdn.email/content/guids/CABINET_df63194db6cb408d82ccda0abee83246/images/dollar_2.png"
                                                                            style="display:block;font-size:15px;border:0;outline:none;text-decoration:none;margin:0"
                                                                            height="50"></a> </td>
                                                            </tr>
                                                            <tr class="ci">
                                                                <td align="center" class="dr dq cc"
                                                                    style="Margin:0;padding-right:40px;padding-left:40px;padding-top:10px;padding-bottom:5px">
                                                                    <h2 class="cz br"
                                                                        style="Margin:0;font-family:montserrat, helvetica, arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:normal;line-height:24px;color:#004b87">
                                                                        <strong>Don’t let your machines gather dust
                                                                            -&nbsp;</strong></h2>
                                                                    <h2 class="cz br"
                                                                        style="Margin:0;font-family:montserrat, helvetica, arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:normal;line-height:24px;color:#004b87">
                                                                        <strong>sell them <span
                                                                                style="color:#fdc62f">NOW</span></strong>
                                                                    </h2>
                                                                </td>
                                                            </tr>
                                                            <!--[if !mso]><!-- -->
                                                            <tr class="cg"
                                                                style="display:none;float:left;overflow:hidden;width:0;max-height:0;line-height:0;mso-hide:all">
                                                                <td align="center" class="dr dq cc"
                                                                    style="Margin:0;padding-right:40px;padding-left:40px;padding-top:10px;padding-bottom:5px">
                                                                    <h2 class="cz br"
                                                                        style="Margin:0;font-family:montserrat, helvetica, arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:normal;line-height:24px;color:#004b87">
                                                                        <strong>Don’t let your machines gather dust -
                                                                            sell them <span
                                                                                style="color:#fdc62f">NOW</span></strong>
                                                                    </h2>
                                                                </td>
                                                            </tr>
                                                            <!--<![endif]-->
                                                            <tr>
                                                                <td align="center" class="cb dp do"
                                                                    style="Margin:0;padding-right:40px;padding-left:40px;padding-bottom:5px;padding-top:5px">
                                                                    <p class="cz bt"
                                                                        style="Margin:0;mso-line-height-rule:exactly;font-family:inter, sans-serif;line-height:22.5px;letter-spacing:0;color:#333333;font-size:15px">
                                                                        We buy machines — from single units to entire
                                                                        factories. Get competitive prices, quick
                                                                        evaluations, and hassle-free transactions. Turn
                                                                        your idle equipment into profit.</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" style="padding:5px;Margin:0">
                                                                    <!--[if mso]><a href="https://www.mmsweden.se/sell-to-us" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://www.mmsweden.se/sell-to-us" style="height:35px; v-text-anchor:middle; width:132px" arcsize="50%" stroke="f" fillcolor="#fdc62f"> <w:anchorlock></w:anchorlock> <center style='color:#000000; font-family:Inter, sans-serif; font-size:12px; font-weight:700; line-height:12px; mso-text-raise:1px'>Sell to Us!</center> </v:roundrect></a>
<![endif]-->
                                                                    <!--[if !mso]><!-- --><span class="msohide cw"
                                                                        style="border-style:solid;border-color:transparent;background:#fdc62f;border-width:0px;display:inline-block;border-radius:50px;width:auto;mso-hide:all"><a
                                                                            href="https://www.mmsweden.se/sell-to-us"
                                                                            target="_blank" class="cs"
                                                                            style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#000000;font-size:13px;padding:10px 25px;display:inline-block;background:#fdc62f;border-radius:50px;font-family:Inter, sans-serif;font-weight:bold;font-style:normal;line-height:15.6px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #fdc62f">Sell
                                                                            to Us!</a> </span>
                                                                    <!--<![endif]-->
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" align="center" class="cn" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table cellpadding="0" cellspacing="0" align="center" bgcolor="#00203B" class="dd"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#00203b;border-radius:0px 0px 20px 20px;width:600px"
                                    role="none">
                                    <tr>
                                        <td align="left"
                                            style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px">
                                            <table cellspacing="0" width="100%" cellpadding="0" role="none"
                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr>
                                                    <td valign="top" align="center"
                                                        style="padding:0;Margin:0;width:600px">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation"
                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td align="center"
                                                                    style="padding:0;Margin:0;padding-bottom:5px;padding-top:5px;font-size:0">
                                                                    <table dir="ltr" cellpadding="0" cellspacing="0"
                                                                        class="cd ct" role="presentation"
                                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                        <tr>
                                                                            <td align="center" valign="top"
                                                                                style="padding:0;Margin:0;padding-right:15px">
                                                                                <a target="_blank"
                                                                                    href="https://www.facebook.com/www.mmsweden.se/"
                                                                                    style="mso-line-height-rule:exactly;text-decoration:underline;color:#666666;font-size:12px"><img
                                                                                        src="https://dccld.stripocdn.email/content/assets/img/social-icons/logo-white/facebook-logo-white.png"
                                                                                        title="Facebook" width="25"
                                                                                        alt="Fb" height="25"
                                                                                        style="display:block;font-size:15px;border:0;outline:none;text-decoration:none;margin:0"></a>
                                                                            </td>
                                                                            <td align="center" valign="top"
                                                                                style="padding:0;Margin:0;padding-right:15px">
                                                                                <a target="_blank"
                                                                                    href="https://www.linkedin.com/company/meat-machines-sweden-ab"
                                                                                    style="mso-line-height-rule:exactly;text-decoration:underline;color:#666666;font-size:12px"><img
                                                                                        src="https://dccld.stripocdn.email/content/assets/img/social-icons/logo-white/linkedin-logo-white.png"
                                                                                        title="LinkedIn" width="25"
                                                                                        alt="In" height="25"
                                                                                        style="display:block;font-size:15px;border:0;outline:none;text-decoration:none;margin:0"></a>
                                                                            </td>
                                                                            <td align="center" valign="top"
                                                                                style="padding:0;Margin:0"><a
                                                                                    target="_blank"
                                                                                    href="https://www.youtube.com/@meatmachinesswedenab6915"
                                                                                    style="mso-line-height-rule:exactly;text-decoration:underline;color:#666666;font-size:12px"><img
                                                                                        src="https://dccld.stripocdn.email/content/assets/img/social-icons/logo-white/youtube-logo-white.png"
                                                                                        title="YouTube" width="25"
                                                                                        alt="Yt" height="25"
                                                                                        style="display:block;font-size:15px;border:0;outline:none;text-decoration:none;margin:0"></a>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" class="dt ds bk"
                                                                    style="Margin:0;padding-top:10px;padding-bottom:10px;padding-right:25px;padding-left:25px">
                                                                    <p class="cz"
                                                                        style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:19.5px;letter-spacing:0;color:#ffffff;font-size:13px">
                                                                        info@mmsweden.se | +46 411 199 00</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" class="dt ds bk"
                                                                    style="Margin:0;padding-top:10px;padding-bottom:10px;padding-right:25px;padding-left:25px">
                                                                    <p class="cz"
                                                                        style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:19.5px;letter-spacing:0;color:#ffffff;font-size:13px">
                                                                        © 2025 MM Sweden | All Rights Reserved</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" align="center" class="cn" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table cellpadding="0" cellspacing="0" align="center" class="dd"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;border-radius:0px 0px 20px 20px;width:600px"
                                    bgcolor="#00000000" role="none">
                                    <tr>
                                        <td align="left"
                                            style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px">
                                            <table cellspacing="0" width="100%" cellpadding="0" role="none"
                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr>
                                                    <td valign="top" align="center"
                                                        style="padding:0;Margin:0;width:600px">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation"
                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td align="center" class="dt ds bk"
                                                                    style="Margin:0;padding-top:10px;padding-bottom:10px;padding-right:25px;padding-left:25px">
                                                                    <p class="cz bm bl"
                                                                        style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:19.5px;letter-spacing:0;color:#666666;font-size:13px">
                                                                        You have received this email because you are a
                                                                        user of MM Sweden and have opted in when you
                                                                        contacted us direct and/or by submitting contact
                                                                        form on our website.</p>
                                                                    <p class="cz bm bl"
                                                                        style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:19.5px;letter-spacing:0;color:#666666;font-size:13px">
                                                                        <br />Want to change how you receive these
                                                                        emails?<br />
                                                                        You can update your <em><a target="_blank"
                                                                                style="mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:13px;font-family:arial, 'helvetica neue', helvetica, sans-serif"
                                                                                href="*|UPDATE_PROFILE|*">preferences</a></em>
                                                                        or <em><a target="_blank"
                                                                                style="mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:13px;font-family:arial, 'helvetica neue', helvetica, sans-serif"
                                                                                href="*|UNSUB|*">unsubscribe</a>.</em>
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" align="center" class="cl" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table cellpadding="0" cellspacing="0" align="center" class="de"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;border-radius:20px 20px 0px 0px;width:600px"
                                    role="none">
                                    <tr>
                                        <td align="left" style="padding:0;Margin:0">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr>
                                                    <td align="center" valign="top"
                                                        style="padding:0;Margin:0;width:600px">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation"
                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td align="center" height="25"
                                                                    style="padding:0;Margin:0"></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>
  `;
};
