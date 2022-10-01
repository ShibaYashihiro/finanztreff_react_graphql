import {ReactNode, useContext} from "react";
import { SearchBondCriterion } from "graphql/types";
import {
    EnabledProps,
    CriteriaState,
    generateBondCard,
    wrapBondSearchCard,
    BaseBondSearchProps, GlobalBondSearchProps
} from "../BaseBondSearchCard";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";
import BondSearchContext, {BondSearchContextProps} from "../BondSearchContext";
import {BondTypeOption, DEFAULT_BOND_OPTION_ID, renderDefaultQuery} from "../../utils";

interface FundVolumeCardProps extends BaseBondSearchProps {
    children?: ReactNode;
}

interface FundVolumeCardState extends GlobalBondSearchProps {
    mode: "greater" | "less",
    value: number;
    valueId: string;
}

function FundVolumeCardContentView(props: CriteriaState<FundVolumeCardState>)  {
    const metadataContext = useContext(BondSearchContext);
    const typeOptions = ((metadataContext && metadataContext.bondTypes) || []);

    return (
        <>
            <FilterDropdownItem<BondTypeOption>
                onSelect={(option: BondTypeOption) => {
                    props.setCriteria({ ...props.state, typeId: option.id});
                }}
                options={typeOptions}
                activeId={"" + props.state.typeId || DEFAULT_BOND_OPTION_ID}
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>mit</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={ANLEIHEN_RENDITE_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

function renderQuery(state: FundVolumeCardState, metadata: BondSearchContextProps | null): SearchBondCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        keyFigures: []
    }
}

const ANLEIHEN_RENDITE_OPTIONS: (OptionItem & {value: number})[] = [
    {id: "0", name: 'konst. Verzinsung (Straight Bonds)', value: 0},
    {id: "1", name: 'variabler Verzinsung (Floater)', value: 1},
    {id: "2", name: 'Nullkupon', value: 2},
];

export const AnleihenBondsTypeCard = wrapBondSearchCard(
    generateBondCard<FundVolumeCardProps & EnabledProps, FundVolumeCardState>(
        FundVolumeCardContentView,
    ),
    renderQuery,
    {nominalCurrencyId: null, typeId: null, regionId: null, issuerId: null, mode: "greater", value: 50, valueId: "50"},
    true,
    ""
);
