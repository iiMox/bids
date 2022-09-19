import React from "react";
import DashboardNav from "../../helpers/DashboardNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvisRow from "../../helpers/AvisRow";
import { connect } from "react-redux";
import { getAvisCandidat, supprimerAvis } from "../../actions/avis";
import { loadUser } from "../../actions/auth";

import "../DemandsPage/DemandsPage.css";
import Alert from "../../helpers/Alert";
import AvisFormUpdate from "../../helpers/AvisFormUpdate";

class AvisPage extends React.Component {
    constructor(props) {
        super(props);

        this.deleteRef = React.createRef();
        this.updateRef = React.createRef();
    }

    async componentDidMount() {
        await this.props.loadUser();
        await this.props.getAvisCandidat(this.props.candidat._id);
    }

    handleDeleteBox() {
        if (this.deleteRef.current.style.dispaly === "flex") {
            this.deleteRef.current.style.dispaly = "none";
        } else {
            this.deleteRef.current.style.dispaly = "flex";
        }
        console.log(this.deleteRef.current.style.dispaly);
    }

    renderMesAvis() {
        const mesAvisArray = [];
        this.props.mesAvis.forEach((avis) => {
            mesAvisArray.push(
                <AvisRow
                    key={avis._id}
                    avisId={avis._id}
                    entrepriseId={avis.entreprise}
                    commentaire={avis.commentaire}
                    datePosté={avis.datePosté}
                    evaluation={avis.evaluation}
                    state={avis.etat}
                    reference={this.updateRef}
                    deleteRef={this.deleteRef}
                />
            );
        });
        return mesAvisArray;
    }

    renderNbrAvisAccepter() {
        let i = 0;
        this.props.mesAvis.forEach((avis) => {
            if (avis.etat === "Accepté") {
                i++;
            }
        });
        return i;
    }

    searchInTable() {
        var input, filter, table, tr, td, td1, i, txtValue, txtValue1;
        input = document.getElementById("searchInAvisTable");
        filter = input.value.toUpperCase();
        table = document.getElementById("avisTable");
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            td1 = tr[i].getElementsByTagName("td")[1];
            if (td && td1) {
                txtValue = td.textContent || td.innerText;
                txtValue1 = td1.textContent || td1.innerText;
                if (
                    txtValue.toUpperCase().indexOf(filter) > -1 ||
                    txtValue1.toUpperCase().indexOf(filter) > -1
                ) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    render() {
        return (
            <div className="demands">
                <DashboardNav />
                <AvisFormUpdate reference={this.updateRef} />
                <div className="demands-content">
                    <div className="container">
                        <h2>Mes avis</h2>
                        <div className="demands-stats">
                            <div className="demands-send animate__animated animate__bounceInLeft">
                                <div>
                                    <FontAwesomeIcon icon={["fas", "share"]} />
                                    Avis postés
                                </div>
                                <span>{this.props.mesAvis.length}</span>
                            </div>
                            <div className="demands-accepted animate__animated animate__bounceInRight">
                                <div>
                                    <FontAwesomeIcon
                                        icon={["fas", "check-circle"]}
                                    />
                                    Avis publier
                                </div>
                                <span>{this.renderNbrAvisAccepter()}</span>
                            </div>
                        </div>
                        <div className="table-container">
                            <div className="search-bar animate__animated animate__bounceInUp">
                                <input
                                    type="text"
                                    id="searchInAvisTable"
                                    onKeyUp={(e) => {
                                        this.searchInTable(e);
                                    }}
                                />
                                <FontAwesomeIcon icon={["fas", "search"]} />
                            </div>
                            <hr />
                            <div className="delete-box" ref={this.deleteRef}>
                                <div className="delete-container">
                                    <h4 className="text-center">
                                        Avertissement
                                    </h4>
                                    <hr />
                                    <Alert />
                                    <p>Voulez-vous vraiment supprimer ?</p>
                                    <div className="buttons-container">
                                        <button
                                            onClick={() => {
                                                this.props.supprimerAvis(
                                                    this.props.avisIdToDelete
                                                );
                                                setInterval(
                                                    () =>
                                                        document.location.reload(),
                                                    2550
                                                );
                                            }}
                                        >
                                            Oui
                                        </button>
                                        <button
                                            onClick={() => {
                                                this.deleteRef.current.style.display =
                                                    "none";
                                            }}
                                        >
                                            Non
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <table
                                className="animate__animated animate__bounceInUp"
                                id="avisTable"
                            >
                                <thead>
                                    <tr className="table-header">
                                        <th>Entreprise</th>
                                        <th>Commentaire</th>
                                        <th>Date postée</th>
                                        <th>Evaluation</th>
                                        <th>Etat</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>{this.renderMesAvis()}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    mesAvis: state.avis.avisCandidat,
    candidat: state.auth.user,
    avisIdToDelete: state.avis.avisIdToDelete,
    avisIdToUpdate: state.avis.avisToUpdate,
});
export default connect(mapStateToProps, {
    getAvisCandidat,
    loadUser,
    supprimerAvis,
})(AvisPage);
