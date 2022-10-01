import { useState } from 'react';
import { Button, Row, Spinner } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { Query } from "../../../generated/graphql";
import { loader } from "graphql.macro";
import { AnalysesGridComponent } from 'components/analyses/AnalysesGridComponent';
import SvgImage from 'components/common/image/SvgImage';
import { NavLink } from "react-router-dom";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

export const LatestAnalysisSection = (props: { groupId: number }) => {
    const analysisItemSize = useBootstrapBreakpoint({
        xl: 9,
        md: 4,
        sm: 3,
        default: 3
    });

    let { loading, data, fetchMore } = useQuery<Query>(
        loader('./getAnalyses.graphql'),
        {
            variables: {
                first: analysisItemSize, after: null,
                instrumentGroupId: props.groupId,
            }
        }
    );

    let [loadingMore, setState] = useState(false);

    if (loading) {
        return(
        <div className="text-center py-2">
            <Spinner animation="border" />
        </div>);
    }

    return (
        <section className="main-section">
            <div className="container px-lg-2">
                <h2 className="section-heading font-weight-bold pl-xl-2 ml-n2 ml-md-1">Neueste Analysen</h2>
                <AnalysesGridComponent analyses={data?.group?.analysis?.edges.map(current => current.node) || []} />
                {(loading || loadingMore) ?
				<Row style={{height: "50px"}} className="d-flex justify-content-center pt-2">
                    <Spinner animation="border"/>
				</Row> :
                <Row>
                    <div className="col-md-4 offset-md-4 col-12">
                        <div className="text-center">
                            <Button variant="link" onClick={() => {
                                trigInfonline(guessInfonlineSection(), "load_more_analysen")
                                if (!loading && data?.group?.analysis?.pageInfo?.endCursor) {
                                    setState(true);
                                    if (fetchMore) {
                                        fetchMore({
                                            variables: {
                                                first: analysisItemSize,
                                                after: data.group?.analysis?.pageInfo.endCursor,
                                            }
                                        })
                                            .finally(() => setState(false))
                                    }
                                }

                            }}>
                                Mehr anzeigen
                                <SvgImage spanClass="top-move" convert={false} width={"27"}
                                    icon="icon_direction_down_blue_light.svg"
                                    imgClass="svg-primary" />
                            </Button>
                        </div>
                    </div>
                    <div className="col-md-4 col-12 text-center mt-xl-4 mr-auto pr-xl-4">
                        <NavLink to="/analysen">
                            <Button className="float-md-right">Alle Analysen</Button>
                        </NavLink>
                    </div>
                </Row>
}
            </div>
        </section>
    );
}
