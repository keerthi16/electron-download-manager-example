function generateTemplete(args) {
    const itemName = args.name;
    const id = args.id;

    return (`<div id="${id}-main" class="first-col">
            <div class="download">
                <div class="download-first-row">
                    <div class="clearfix"></div>
                    <div class="row-icon"><i class="fa fa-picture-o" aria-hidden="true"></i></div>
                    <div class="row-content">
                        <div class="download-bar">
                            <div class="download-bar-header">${itemName}</div>
                            <div id="${id}-bar" class="download-bar-progress">
                                <progress id="${id}-progress" class="progress-bar"></progress>
                            </div>
                            <div id="${id}" class="dowload-bar-footer"></div>
                            <div id="${id}-per" class="dowload-bar-footer">0%</div> 
                        </div>
                        <div id="${id}-actions" class="row-content p-5 hidden">
                            <span id="${id}-open"><i class="fa fa-folder" aria-hidden="true"></i></span>
                            <span id="${id}-close"><i class="fa fa-times-circle-o" aria-hidden="true"></i></span>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>`);
}

module.exports = generateTemplete;
