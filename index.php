<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Micro Machine v3</title>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/style.min.css">
    <script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="js/popper.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/app.min.js"></script>
    <meta name="apple-mobile-web-app-title" content="Micro Machines v3 Scoresheet"/>
    <meta name="application-name" content="Micro Machines v3 Scoresheet"/>
    <link rel="apple-touch-icon" sizes="76x76" href="icons/icon-76.png">
    <link rel="icon" type="image/png" href="icons/icon-64.png">
    <link rel="manifest" href="manifest.json">
</head>
<body>

<?php $players = [
    ['name' => 'NLOle', 'char' => 'walther.png'],
    ['name' => 'NLO', 'char' => 'jethro.png'],
    ['name' => 'Chode', 'char' => 'dwayne.png'],
    ['name' => 'Aso', 'char' => 'cherry.png'],
    ['name' => 'Joman', 'char' => 'noob.png'],
]; ?>

<div class="winner text-center text-success" style="display: none;">
    <div class="mt-2 mt-md-5"><h3>Vinner <?=date('Y');?></h3></div>
    <div><h3 data-role="winner-name">NLO</h3></div>

    <div class="mt-2 mt-md-5">
        <figure class="figure bg-success rounded p-1 p-md-3">
            <img src="jethro.png" class="figure-img img-fluid-rounded" alt="Winner" data-role="winner-image">
        </figure>
    </div>
    <div><picture><img src="trophy.png"></picture></div>
    <div class="text-center m-2">
        <button type="button" data-role="reset" class="btn btn-danger">Reset</button> <button type="button" data-role="continue" class="btn btn-success">Fortsett</button>
    </div>
</div>

<div class="row mx-auto">
    <div class="col-12 m-sm-0 m-md-2 text-center">

        <h2 class="text-success">Micro Machines v3 Scoresheet</h2>

        <div class="players m-1 m-md-4">

            <?php for($i = 0; $i < sizeof($players); $i++) :?>
                <div class="d-inline-block ml-md-2 mr-md-2 align-top" data-role="profile" data-player="<?=$i;?>">
                    <figure class="figure bg-success rounded p-1 p-md-3 d-block">
                        <img src="<?=$players[$i]['char'];?>" class="figure-img img-fluid-rounded" alt="<?=ucfirst(substr($players[$i]['char'], 0, strrpos($players[$i]['char'], '.')));?>">
                        <figcaption class="figure-caption text-center text-white"><?=$players[$i]['name'];?></figcaption>
                    </figure>
                    <div data-role="round-score-selector" data-player="<?=$i;?>" style="display: none">
                        <div class="btn btn-success mb-2" data-roundpos="1" data-pressed="false">1st</div>
                        <div class="btn btn-primary mb-2" data-roundpos="2" data-pressed="false">2nd</div>
                        <div class="btn btn-warning mb-2" data-roundpos="3" data-pressed="false">3rd</div>
                        <div class="btn btn-info mb-2" data-roundpos="4" data-pressed="false">4th</div>
                        <div class="btn btn-danger mb-2" data-roundpos="5" data-pressed="false">5th</div>
                    </div>
                </div>
            <?php endfor; ?>
        </div>
        <button type="button" data-role="save-round" class="btn btn-success" style="display: none">Lagre Runde</button>
    </div>
    <div class="col-12 col-sm-9 col-md-8 col-lg-7 col-xl-6 m-0 p-0 mx-auto">

        <div class="text-center m-4">
            <button type="button" class="btn btn-success" data-role="start-game">Start MMv3</button>
        </div>

        <div data-role="scoresheet" style="display: none">

            <table class="table table-sm-responsive table-striped" data-role="table">
                <thead class="bg-success text-white">
                <tr>
                    <td></td>
                    <?php foreach($players as $player): ?>
                        <td><?=$player['name'];?><span class="d-none d-md-inline"> (<?=ucfirst(substr($player['char'], 0, strrpos($player['char'], '.')));?>)</span></td>
                    <?php endforeach; ?>
                </tr>
                </thead>
                <tbody>
                <tr>
                </tr>
                <tr data-role="table-total" class="font-weight-bold">
                    <td>T<span class="d-none d-md-inline-block">otalt</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
                </tr>

                </tbody>

            </table>
        </div>

        <div class="text-center mb-2">
            <button type="button" data-role="reset" class="btn btn-danger" style="display:none;">Reset</button> <button type="button" data-role="save" class="btn btn-success" style="display: none;">Ferdig</button>
        </div>
    </div>

</div>

</body>
</html>