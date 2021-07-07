import React, { useState, useEffect } from 'react';
// Local components Imports
import MyVerticallyCenteredModal from '../Modals/BackdropModal/VerticalBackdropModal';

// Local components Imports
import Navbar from '../Navbar/Navbar';
import DashBoard from '../DashBoard/DashBoard';
// React Bootstrap Imports
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

// Outside packages
import { v4 as uuidv4 } from 'uuid';

// Stylesheet imports
import './ProducerHomePage.scss';

const ProducerHomePage = (props) => {
    let baseUrl;
    // useEffect(() => {
    baseUrl = process.env.NODE_ENV === 'development' ?
        process.env.REACT_APP_BACKEND_DEV_ENDPOINT_URL :
        process.env.REACT_APP_BACKEND_PRODUCTION_ENDPOINT_URL;
    // })
    const [modalShow, setModalShow] = React.useState(false);
    const [foodCapacity, setFoodCapacity] = useState(0);
    const [cuisine, setCuisine] = useState('Make a selection...');
    const [finalPayload, updateFinalPayload] = useState([]); // Array of Servings (objects)
    const [allergicIngredients, setAllergicIngredients] = useState([]);
    const [foodType, setFoodType] = useState('Make a selection...');
    const [preparationDate, setPreparationDate] = useState('');
    const [foodCondition, setFoodCondition] = useState('Fresh'); // Get rating and then allow
    const [editServingId, setEditServingId] = useState(''); // Get rating and then allow
    const [readyToAdd, setReadyToAdd] = useState(false);

    useEffect(async () => {
        if (readyToAdd === true) {
            setReadyToAdd(false);
            // Send Backend
            const rawResponse = await fetch(`${baseUrl}/addEachServings`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalPayload)
            })
            const content = await rawResponse.json();
            console.log(`💚 Food Serving Added ! ${JSON.stringify(content, null, 2)}`);
        }
    }, [readyToAdd]);
    // Set Producer Info:
    // setProducerInfo(props);
    // Form validation
    // Form repeatable
    const updateSelectCuisine = (e) => {
        setCuisine(e.target.value); // Add cuisine prop to variable[index]
    }
    // Set Food Type -> Rice, Dish, Soup etc
    const updateFoodType = (e) => {
        setFoodType(e.target.value)
    }
    // Set Food Capacity 
    const updateFoodCapacity = (e) => {
        // Add cuisine prop to variable[index]
        setFoodCapacity(e.target.value);
    }
    // Set Allergic Ingredients  
    const updateAllergicIngredients = (e) => {
        // Add cuisine prop to variable[index]
        setAllergicIngredients(e.target.value);
    }
    // Set Preparation Date
    const updatePreparationDate = (e) => {
        setPreparationDate(e.target.value)
    }
    // Allow further addition of food source into system after general health check
    const updateFoodGeneralHealth = (e) => {
        setFoodCondition(e.target.value)
    }
    // Add one serving 
    const addAsNewServing = (e) => {
        // Validation
        if (!cuisine) {
            alert('Choose a cuisine!')
            return;
        }
        if (foodCapacity === 0) {
            alert('Enter a valid capacity')
            return;
        }
        // Realise State values here.
        updateFinalPayload([...finalPayload,
        {
            id: uuidv4(), // Key in DB is servingId
            foodCondition,
            foodCapacity,
            foodType,
            cuisine,
            preparationDate,
            allergicIngredients

        }])
        // Add to Payload prop and reset counter:
        setCuisine('Make a selection...');
        setFoodCapacity(0);
    }

    const initiateDelivery = async (e) => {

        e.preventDefault();
        setModalShow(true);
        // Here we adjust save to the currently edited Food Serving
        if (editServingId !== '') {
            const updatedData = finalPayload.map(x => (x.id === editServingId ? {
                ...x,
                foodCondition,
                foodType,
                cuisine,
                preparationDate,
                allergicIngredients
            } : x));
            updateFinalPayload(updatedData);

        }
        setReadyToAdd(true);
        resetState();
        let batchServing = {
            batchId: uuidv4(),
            collectorId: '', // Null Initially
            producerId: props.location.state.producerLoginInfo[0].producerId,
            destinationHubId: '', // Null Initially 
            deliveryStatus: 'wait-for-pickup',
            totalBoxCount: finalPayload.length,
        }
        // Date related payload information is added in Backend

        let baseURLEndpoint = process.env.NODE_ENV === 'development' ?
            process.env.REACT_APP_BACKEND_DEV_ENDPOINT_URL :
            process.env.REACT_APP_BACKEND_PRODUCTION_ENDPOINT_URL;

        // Send to Backend to update in DB
        const batchServingRequest = await fetch(`${baseURLEndpoint}/addBatchServingData`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },

            body: JSON.stringify(batchServing)
        }).catch(err => console.log('Error updating Batch data', err));
    }

    const resetState = () => {
        setCuisine('')
        setFoodType('Make a selection..')
        setFoodCapacity(0)
        setAllergicIngredients([])
        setPreparationDate('')
        setFoodCondition('Fresh')
        setEditServingId('') // Use it to track if any edit in progress
    }
    // Edit Serving Information

    const editRecordInForm = eachServing => e => {
        console.log(eachServing)
        // Set edit form values 
        setCuisine(eachServing.cuisine)
        setFoodType(eachServing.foodType)
        setFoodCapacity(eachServing.foodCapacity)
        setAllergicIngredients(eachServing.allergicIngredients)
        setPreparationDate(eachServing.preparationDate)
        setFoodCondition(eachServing.foodCondition)
        setEditServingId(eachServing.id) // Use it to track if any edit in progress
    }

    // Delete one added serving:
    const deleteSelectedServing = eachServing => e => {
        const deleteSelected = finalPayload.filter(x => x.id !== eachServing.id)
        updateFinalPayload(deleteSelected)
    }
    return <div>
        <div className="producer-home-page-container">
            <div className="NavBar">
                <Navbar
                    loggedinuser={props.location.state.producerLoginInfo[0].producerName}
                />
            </div>
            <div className="producer-home-page-inner-container">
                <div className="dashboard">
                    <DashBoard
                        navItems={["Profile settings", "All Food Dispensed", "Distribution Frequency", "Most Common Food types distributed", "Request Distribution Boxes"]}
                    />
                </div>
                <div className="producer-home-page">
                    <div className="enter-food-serving-details">
                        <h1> Enter Details of dispatch</h1>
                        <Form onSubmit={initiateDelivery}>
                            {/* Food General Health  */}
                            <Form.Group controlId="foodGeneralHealth"
                                required={true}
                            >
                                <Form.Label>Rate Food health condition </Form.Label>
                                <Form.Control as="select" custom
                                    onChange={updateFoodGeneralHealth}
                                    value={foodCondition}
                                    required={true}
                                >
                                    <option disabled>Make a selection...</option>
                                    <option>Fresh</option>
                                    <option>Stale</option>
                                    <option>Fungus appearance</option>
                                    <option>Pungent smelling</option>
                                    <option>Not sure</option>
                                </Form.Control>
                            </Form.Group>

                            {/* Cuisine Selection Starts here */}
                            <Form.Group controlId="formFoodCuisine"
                                required={true}
                            >
                                <Form.Label>Select Cuisine </Form.Label>
                                <Form.Control as="select" custom
                                    onChange={updateSelectCuisine}
                                    value={cuisine}
                                    disabled={foodCondition !== 'Fresh'}
                                >
                                    <option disabled>Make a selection...</option>
                                    <option>Indian</option>
                                    <option>Japanese</option>
                                    <option>Chinese</option>
                                    <option>Italian</option>
                                    <option>Greek</option>
                                    <option>Others</option>
                                </Form.Control>
                            </Form.Group>
                            {/* Cuisine Selection Ends here */}

                            {/* Food Type - Rice, Dessert etc Starts here*/}

                            <Form.Group controlId="formFoodTypes">
                                <Form.Label>Select Food Type </Form.Label>
                                <Form.Control as="select" custom
                                    onChange={updateFoodType}
                                    value={foodType}
                                    disabled={foodCondition !== 'Fresh'}
                                >
                                    <option disabled>Make a selection...</option>
                                    <option>Dressing</option>
                                    <option>Dessert</option>
                                    <option>Dish</option>
                                    <option>Drinks</option>
                                    <option>Pure Ingredients</option>
                                    <option>Rice</option>
                                    <option>Soup</option>
                                    <option>Utensils</option>
                                    <option>Others</option>
                                </Form.Control>
                            </Form.Group>
                            {/* Food Type - Rice, Dessert etc Ends here*/}


                            {/* Serving Capacity # Starts here */}
                            <Form.Group controlId="maxServingCapacity">
                                <Form.Label>Number of Servings</Form.Label>
                                <Form.Control type="number" placeholder="Serving Capacity in Numbers"
                                    onChange={updateFoodCapacity}
                                    value={foodCapacity}
                                    disabled={foodCondition !== 'Fresh'}
                                />
                            </Form.Group>
                            {/* Serving Capacity # Ends here */}


                            {/* Allergic Ingredients Start here */}
                            <Form.Group controlId="allergicIngredients">
                                <Form.Label>Special Ingredients that may irritate allergy </Form.Label>
                                <Form.Control as="select" custom
                                    placeholder="Allergic Ingredients"
                                    onChange={updateAllergicIngredients}
                                    value={JSON.stringify(allergicIngredients)}
                                    disabled={foodCondition !== 'Fresh'}
                                >
                                    <option>Make a selection...</option>
                                    <option>Nuts</option>
                                    <option>Shell</option>
                                    <option>Caffeine</option>
                                    <option>Dairy</option>
                                    <option>Others</option>
                                </Form.Control>
                            </Form.Group>
                            {/* Allergic Ingredients End here */}

                            {/* Preparation Date inputs Starts here */}
                            <Form.Group controlId="allergicIngredients">
                                <Form.Label>Food Preparation Time</Form.Label>
                                <Form.Control type="time" placeholder="Enter "
                                    onChange={updatePreparationDate}
                                    value={preparationDate}
                                    disabled={foodCondition !== 'Fresh'}
                                />
                            </Form.Group>
                            {/* Preparation Date inputs Ends here */}

                            <div className="add-more-servings">
                                <Button variant="secondary" type="button" onClick={addAsNewServing}>
                                    Add more Servings (+)
                </Button>
                            </div>


                            {/* Submit button */}
                            <div className="submitFoodToDispatch">
                                <Button variant="primary" type="submit"
                                    disabled={finalPayload.length === 0}
                                    style={{ cursor: finalPayload.length === 0 ? "not-allowed" : "pointer" }}
                                >
                                    {editServingId !== '' ? 'Save Changes' : 'Initiate Delivery'}
                                </Button>
                            </div>

                        </Form>
                    </div>

                    {/* <p> {JSON.stringify(finalPayload)} </p> */}

                    <div className="allServingsTable">
                        <Table striped bordered hover style={{ visibility: finalPayload.length >= 1 ? "visible" : "hidden" }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Food Condition</th>
                                    <th>Food Type</th>
                                    <th>Cuisine</th>
                                    <th>Servings Capacity</th>
                                    <th>Allergic Ingredients</th>
                                    <th>Food Preparation</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(finalPayload).map((eachServing, index) => {
                                    return <tr key={eachServing.id}>
                                        <td>{index + 1}</td>
                                        <td>{eachServing.foodCondition}</td>
                                        <td>{eachServing.foodType}</td>
                                        <td>{eachServing.cuisine}</td>
                                        <td>{eachServing.foodCapacity}</td>
                                        <td>{JSON.stringify(eachServing.allergicIngredients)}</td>
                                        <td>{JSON.stringify(eachServing.preparationDate)}</td>
                                        <td><Button variant="secondary" type="button"
                                            onClick={editRecordInForm(eachServing)}
                                        >Edit</Button></td>
                                        <td><Button variant="secondary" type="button"
                                            onClick={deleteSelectedServing(eachServing)}
                                        >Delete</Button></td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </div>

                </div>
                {/* custom props needs to be all-lowercased */}
            </div>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                modalheading={'Start Delivery Process'}
                modalcenteredheading={'Delivery Options'}
                modaldeliverypreference={'Do you want to delivery it yourself or do you want to wait for a collector?'}
                producerinfo={props.location.state.producerLoginInfo}
                modaltype='initiate-delivery-confirmation'
                producerservingsinformation={finalPayload}
            />
        </div>
    </div>;
}

export default ProducerHomePage;
            //