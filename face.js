// Update the inference function to show percentages
var infer = function() {
    $('#output').html("<div class='loading'>Analyzing...</div>");
    $("#resultContainer").show();
    $('html').scrollTop(100000);

    getSettingsFromForm(function(settings) {
        settings.error = function(xhr) {
            $('#output').html("<div class='error'>Error analyzing image. Check your API key and try again.</div>");
        };

        $.ajax(settings).then(function(response) {
            // Process the predictions to show percentages
            var predictions = response.predictions || [];
            var bpPrediction = predictions.find(p => p.class.toLowerCase().includes('bell'));
            var confidence = bpPrediction ? Math.round(bpPrediction.confidence * 100) : 0;
            
            // Create visual percentage display
            var resultHtml = `
                <div class="result-container">
                    <div class="probability-meter">
                        <div class="probability-bar" style="width: ${confidence}%"></div>
                    </div>
                    <div class="probability-text">${confidence}% probability of Bell's Palsy</div>
                    ${getRecommendation(confidence)}
                </div>
                <pre class="raw-data">${JSON.stringify(response, null, 4)}</pre>
            `;
            
            $('#output').html(resultHtml);
            $('html').scrollTop(100000);
        });
    });
};

// Helper function to generate recommendation text
function getRecommendation(confidence) {
    if (confidence > 70) {
        return `<div class="recommendation high">
            <strong>High probability detected</strong><br>
            We recommend consulting a neurologist for evaluation
        </div>`;
    } else if (confidence > 30) {
        return `<div class="recommendation medium">
            <strong>Moderate probability detected</strong><br>
            Consider monitoring symptoms or consulting a doctor
        </div>`;
    } else {
        return `<div class="recommendation low">
            <strong>Low probability detected</strong><br>
            No significant facial asymmetry found
        </div>`;
    }
}