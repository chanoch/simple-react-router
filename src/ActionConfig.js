/** 
 * Sample ActionConfig class to base your implementations on.
 * 
 * The private elements of this function are mainly to simplify use rather than to provide
 * any kind of security of invariability.
 */
export default function ActionConfig() {
    const ACTION_NAME = "ACTION_NAME";
    
    const actionCreator = function() {
        return {
            type: ACTION_NAME,
        }        
    };

    const loadData = function(dispatch) {
    /*     Call some data service.then(data => {
     *         ActionConfig.dispatchAction(dispatch, data);
     *///  });f
    };

    return {
        type: ACTION_NAME,
        
        middleware() {
            return store => dispatch => action => {
                dispatch(action);
                if(action.type===ACTION_NAME) {
                    loadData(dispatch);
                }
            }
        },

        dispatchAction(dispatch) {
            dispatch(actionCreator());
        },
    }
}