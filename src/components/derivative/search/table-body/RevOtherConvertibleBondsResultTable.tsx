import React, {useState} from "react";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import WKN, {Ask, Bid, DelayIndicator, DueTo, DueToValue, Time} from "./common/CommonTableElements";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import SvgImage from "../../../common/image/SvgImage";
import {Button, Collapse} from "react-bootstrap";
import classNames from "classnames";
import {computeDueToCss} from "../DerivativeSearchResult";
import {quoteFormat} from "../../../../utils";
import {PortfolioInstrumentAdd} from "../../../common";
import {getPerformance, getQuanto} from "../../../Assets/CertificatesPage/WarrantCharacteristicsContainer";
import {CalculationPeriod, Instrument} from "../../../../generated/graphql";
import {getUnderlyingsBasisprise} from "../../../Assets/Derivatives/components/WarrantCharacteristics";

export const RevOtherConvertibleBondsResultTable = ({
                                                        group,
                                                        loading,
                                                        wkn,
                                                        ask,
                                                        bid,
                                                        dueTo,
                                                        id,
                                                        typeNameValue,
                                                        assetTypeValue,
                                                        performance
                                                    }: DerivativeResultTableProps) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <tr className="border-bottom border-border-gray">
                <td className="font-weight-bold pl-0 text-nowrap">
                    <WKN assetTypeValue={assetTypeValue} typeNameValue={typeNameValue} group={group} wkn={wkn}/>
                </td>
                <td className="d-table-cell pl-0 ml-0 pr-0 mr-0">{group.assetType?.name}</td>
                <td className={"d-md-table-cell d-none text-right"}>{getPerformance(performance, CalculationPeriod.Month1)}</td>
                {/*<td className={"d-md-table-cell d-none"}>{getQuanto(group.derivative)}</td>*/}
                <DueTo dueTo={dueTo} classNameLong={"d-md-table-cell d-none"}/>
                <td className={"d-md-table-cell d-none"}>{group?.issuer?.name}</td>
                <Bid bid={bid} group={group} loading={loading}/>
                <Ask ask={ask} group={group} loading={loading}/>
                <DelayIndicator loading={loading} bid={bid}/>
                <Time bid={bid} loading={loading}/>
                <td className="p-0 text-right pt-xl-1">
                    {id && group.id &&
                        <ProfileInstrumentAddPopup name={group.name} instrumentId={id} instrumentGroupId={group.id}
                                                   portfolio={true} watchlist={true}
                                                   className="d-none d-xl-table-cell"
                        >
                            <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons" imgClass="plus-butt-icon"/>
                        </ProfileInstrumentAddPopup>
                    }
                    <Button variant="link" onClick={() => setOpen(!open)}
                            className="p-0 d-inline-block d-xl-none">
                        <img alt="Collapse arrow down" style={{width: 40}}
                             className="cursor-pointer mt-md-0"
                             src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}
                        />
                    </Button>
                </td>
            </tr>

            <tr className="d-xl-none">
                <td colSpan={12} className="p-0 ">
                    <Collapse in={open}>
                        <div>
                            <div className="d-none d-lg-block">
                                <div className="p-1">
                                    {id && group.id &&
                                        <span className="d-inline-block ml-n3" style={{width: '64px'}}>
                                            <ProfileInstrumentAddPopup name={group.name} instrumentId={id}
                                                                       instrumentGroupId={group.id}>
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </ProfileInstrumentAddPopup>
                                        </span>
                                    }
                                    <span className="pl-4">Zeit: <b>{quoteFormat(bid?.when)}</b></span>
                                </div>
                            </div>

                            <div className="font-size-14px mr-3 d-lg-none">
                                <div className="p-2">
                                    <div className="d-flex justify-content-center">
                                        <div className="px-0 text-center ml-n1">
                                            <PortfolioInstrumentAdd variant="link" className="text-white p-0 m-0">
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </PortfolioInstrumentAdd>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <div>
                                        Performance:<b> {getPerformance(performance, CalculationPeriod.Month1)}</b>
                                    </div>
                                    <div>Fälligkeit:
                                        <b
                                            className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 d-xl-table-cell text-nowrap")}
                                        > <DueToValue dueTo={dueTo} /></b>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <div>Emittent: <b>{group.issuer?.name}</b></div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div>Zeit: <b>{quoteFormat(bid?.when)}</b></div>
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </td>
            </tr>

        </>
    )
}

export default RevOtherConvertibleBondsResultTable
